import { Request, Response } from 'express';
import prisma from '@repo/db/client';
import { handleError } from '../utils/errorHandler';
import { getProblemMarkdown } from '../utils/getProblemMarkdown';
import {
	getPartialBoilerplate,
	getFullBoilerplate,
} from '../utils/getProblemCode';
import { LanguageMapping } from '@repo/language/LanguageMapping';
import { CreateProblemSchema } from '@repo/common-zod/types';
import { DefaultCodeType } from '@repo/db/client';

export const getProblems = async (req: Request, res: Response) => {
	const skip = parseInt(req.query.skip as string) || 0;
	const take = parseInt(req.query.take as string) || 50;

	const problems = await prisma.problem.findMany({
		skip: skip,
		take: take,
		where: { hidden: false },
		select: {
			id: true,
			title: true,
			difficulty: true,
			slug: true,
		},
	});

	if (!problems) {
		return handleError(res, 404, 'No problems found');
	}

	res.status(200).json(problems);
};

export const getProblem = async (req: Request, res: Response) => {
	const problemSlug = req.params.problemSlug as string;
	const languageId = req.query.languageId as string;

	const dbProblem = await prisma.problem.findUnique({
		where: { slug: problemSlug, hidden: false },
	});
	if (!dbProblem) {
		return handleError(res, 404, 'Problem not found');
	}

	const language = LanguageMapping[languageId];
	if (!language) {
		return handleError(res, 400, 'Unsupported language');
	}

	const problemMarkdown = await getProblemMarkdown(problemSlug);
	const partialBoilerpalteCode = await getPartialBoilerplate({
		slug: problemSlug,
		fileExtension: language.fileExtension,
	});

	res.status(200).json({
		problemMarkdown,
		partialBoilerpalteCode,
	});
};

export const getPartialBoilerplateCodeByLanguageId = async (
	req: Request,
	res: Response
) => {
	const problemSlug = req.params.problemSlug as string;
	const languageId = req.query.languageId as string;

	const problem = await prisma.problem.findUnique({
		where: { slug: problemSlug },
		select: { id: true, slug: true },
	});

	if (!problem) {
		return handleError(res, 404, 'Problem not found');
	}

	const language = LanguageMapping[languageId];
	if (!language) {
		return handleError(res, 400, 'Unsupported language');
	}

	const partialBoilerpalteCode = await getPartialBoilerplate({
		slug: problemSlug,
		fileExtension: language.fileExtension,
	});

	res.status(200).json({
		partialBoilerpalteCode,
	});
};

export const deleteProblem = async (req: Request, res: Response) => {
	const problemSlug = req.params.problemSlug as string;

	const problem = await prisma.problem.update({
		where: { slug: problemSlug },
		data: { hidden: true },
	});

	res.status(200).json({ message: 'Problem deleted successfully', problem });
};

export const createProblem = async (req: Request, res: Response) => {
	const parsedBody = CreateProblemSchema.parse(req.body);

	if (!parsedBody) {
		return handleError(res, 400, 'Invalid request body');
	}

	const { title, problemSlug, difficulty, hidden, problemType } = parsedBody;

	try {
		const problemMarkdown = await getProblemMarkdown(problemSlug);

		await prisma.$transaction(async (tx) => {
			const problem = await tx.problem.create({
				data: {
					title,
					slug: problemSlug,
					hidden,
					difficulty,
					type: { set: problemType },
					description: problemMarkdown,
				},
			});

			const defaultCodeQueries = Object.entries(LanguageMapping).flatMap(
				([, language]) => {
					return [
						(async () => {
							const partialBoilerplate =
								await getPartialBoilerplate({
									slug: problemSlug,
									fileExtension: language.fileExtension,
								});

							return tx.defaultCode.create({
								data: {
									code: partialBoilerplate,
									languageId: language.internal,
									problemId: problem.id,
									DefaultCodeType:
										DefaultCodeType.PARTIALBOILERPLATECODE,
								},
							});
						})(),
						(async () => {
							const fullBoilerplate = await getFullBoilerplate({
								slug: problemSlug,
								fileExtension: language.fileExtension,
							});

							return tx.defaultCode.create({
								data: {
									code: fullBoilerplate,
									languageId: language.internal,
									problemId: problem.id,
									DefaultCodeType:
										DefaultCodeType.FULLBOILERPLATECODE,
								},
							});
						})(),
					];
				}
			);

			await Promise.all(defaultCodeQueries);
		});

		res.status(200).json({ message: 'Problem created successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Failed to create problem', error });
	}
};
