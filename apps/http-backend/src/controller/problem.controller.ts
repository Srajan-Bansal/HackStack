import { Request, Response } from 'express';
import prisma from '@repo/db/client';
import { handleError } from '../utils/errorHandler';

export const getProblems = async (req: Request, res: Response) => {
	const skip = parseInt(req.query.skip as string) || 0;
	const take = parseInt(req.query.take as string) || 50;

	const problems = await prisma.problem.findMany({
		skip: skip,
		take: take,
		select: {
			id: true,
			title: true,
			difficulty: true,
		},
	});

	if (!problems) {
		return handleError(res, 404, 'No problems found');
	}

	res.status(200).json(problems);
};

export const getProblem = async (req: Request, res: Response) => {
	const problemSlug = req.params.slug as string;

	if (!problemSlug) {
		return handleError(res, 400, 'Invalid problem slug');
	}

	const problem = await prisma.problem.findUnique({
		where: { slug: problemSlug },
	});

	if (!problem) {
		return handleError(res, 404, 'Problem not found');
	}

	res.status(200).json(problem);
};

export const submitProblem = async (req: Request, res: Response) => {
	const problemSlug = req.params.slug as string;

	if (!problemSlug) {
		return handleError(res, 400, 'Invalid problem slug');
	}

	const { code } = req.body;

	if (!code) {
		return handleError(res, 400, 'Invalid code');
	}

	// Submit code to judge
	// const result = await judge(code);

	res.status(200).json({ result: 'Accepted' });
};

export const getProblemSubmissions = async (req: Request, res: Response) => {
	const problemSlug = req.params.slug as string;

	if (!problemSlug) {
		return handleError(res, 400, 'Invalid problem slug');
	}

	const getProblemId = await prisma.problem.findUnique({
		where: { slug: problemSlug },
		select: { id: true },
	});

	if (!getProblemId) {
		return handleError(res, 404, 'Problem not found');
	}

	const getAllSubmissions = await prisma.submission.findMany({
		where: { problemId: getProblemId.id },
		select: {
			id: true,
			status: true,
			languageId: true,
			Runtime: true,
			Memory: true,
			createdAt: true,
		},
	});

	if (!getAllSubmissions) {
		return handleError(res, 404, 'No submissions found');
	}

	res.status(200).json(getAllSubmissions);
};
