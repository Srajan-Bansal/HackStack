import { Request, Response } from 'express';
import prisma, { SubmissionStatus, Difficulty } from '@repo/db/client';
import { handleError } from '../utils/errorHandler';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getUserSubmissionsForProblem = async (req: AuthenticatedRequest, res: Response) => {
	try {
		if (!req.userId) {
			return handleError(res, 401, 'Unauthorized');
		}

		const problemSlug = req.params.problemSlug as string;
		const limit = parseInt(req.query.limit as string) || 10;
		const page = parseInt(req.query.page as string) || 1;
		const skip = (page - 1) * limit;

		const problem = await prisma.problem.findUnique({
			where: { slug: problemSlug, hidden: false },
			select: { id: true },
		});

		if (!problem) {
			return handleError(res, 404, 'Problem not found');
		}

		const userSubmissions = await prisma.submission.findMany({
			where: {
				problemId: problem.id,
				userId: req.userId,
			},
			select: {
				id: true,
				status: true,
				runtime: true,
				memory: true,
				languageId: true,
				createdAt: true,
				code: true,
			},
			orderBy: { createdAt: 'desc' },
			skip: skip,
			take: limit,
		});

		res.status(200).json(userSubmissions);
	} catch (error) {
		return handleError(res, 500, 'Failed to fetch submissions');
	}
};

export const getSubmissionDetails = async (req: AuthenticatedRequest, res: Response) => {
	try {
		if (!req.userId) {
			return handleError(res, 401, 'Authentication required');
		}

		const submissionId = req.params.submissionId as string;
		const submission = await prisma.submission.findUnique({
			where: { id: submissionId, userId: req.userId },
			select: {
				id: true,
				status: true,
				code: true,
				runtime: true,
				memory: true,
				languageId: true,
				createdAt: true,
			},
		});

		if (!submission) {
			return handleError(res, 404, 'Submission not found');
		}

		res.status(200).json(submission);
	} catch (error) {
		return handleError(res, 500, 'Failed to fetch submission details');
	}
};

export const getUserSubmissionStats = async (req: AuthenticatedRequest, res: Response) => {
	try {
		if (!req.userId) {
			return handleError(res, 401, 'Authentication required');
		}

		const [totalSubmissions, acceptedSubmissions] = await Promise.all([
			prisma.submission.count({ where: { userId: req.userId } }),
			prisma.submission.count({
				where: { userId: req.userId, status: SubmissionStatus.SUCCESS },
			}),
		]);

		const solvedProblemsByDifficulty = await prisma.problem.groupBy({
			by: ['difficulty'],
			where: {
				Submission: {
					some: {
						userId: req.userId,
						status: SubmissionStatus.SUCCESS,
					},
				},
			},
			_count: true,
		});

		const difficultyMap = { easy: 0, medium: 0, hard: 0 };
		solvedProblemsByDifficulty.forEach((item: any) => {
			const difficulty = item.difficulty.toLowerCase();
			difficultyMap[difficulty as keyof typeof difficultyMap] = item._count;
		});

		const stats = {
			totalSubmissions,
			acceptedSubmissions,
			solvedProblems: difficultyMap.easy + difficultyMap.medium + difficultyMap.hard,
			byDifficulty: difficultyMap,
		};

		res.status(200).json(stats);
	} catch (error) {
		return handleError(res, 500, 'Failed to fetch submission stats');
	}
};
