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
