import { Request, Response } from 'express';
import prisma from '@repo/db/client';
import { handleError } from '../utils/errorHandler';
import { getProblemMarkdown } from '../utils/getProblemMarkdown';
import { getPartialBoilerplate } from '../utils/getProblemCode';

type SUPPORTED_LANGS = 'java' | 'js';

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

	const dbProblem = await prisma.problem.findUnique({
		where: { slug: problemSlug, hidden: false },
	});
	if (!dbProblem) {
		return handleError(res, 404, 'Problem not found');
	}

	const problemMarkdown = await getProblemMarkdown(problemSlug);
	const partialBoilerpalteCode = await getPartialBoilerplate({
		slug: problemSlug,
		languageId: 'java',
	});

	res.status(200).json({
		problemMarkdown,
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
