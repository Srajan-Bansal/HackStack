import { Request, Response } from 'express';
import prisma, {
	ProblemStatus,
	DefaultCodeType,
	SubmissionStatus,
	TestCaseStatus,
} from '@repo/db/client';
import axios from 'axios';
import { SubmissionInputSchema } from '@repo/common-zod/types';
import { handleError } from '../utils/errorHandler';
import { LanguageMapping } from '@repo/language/LanguageMapping';
import { getProblemCode } from '../utils/getProblemCode';

const JUDGE_API_URL = process.env.JUDGE_API_URL;
const JUDGE0_CALLBACK_URL = process.env.JUDGE0_CALLBACK_URL;
const CHUNK_SIZE = 20;

interface SubmissionRequest extends Request {
	userId?: string;
}

export const createBatchSubmission = async (
	req: SubmissionRequest,
	res: Response
) => {
	try {
		const parsedBody = SubmissionInputSchema.parse(req.body);
		if (!parsedBody) {
			return handleError(res, 400, 'Invalid request body');
		}

		const problemSlug = req.params.problemSlug as string;

		const dbProblem = await prisma.problem.findUnique({
			where: { slug: problemSlug },
			select: {
				id: true,
				slug: true,
				DefaultCode: {
					where: {
						languageId:
							LanguageMapping[parsedBody.languageId]?.internal ??
							0,
						DefaultCodeType: DefaultCodeType.FULLBOILERPLATECODE,
					},
					select: {
						code: true,
					},
				},
			},
		});

		if (!dbProblem) {
			return handleError(res, 404, 'Problem not found');
		}

		const problem = await getProblemCode(
			problemSlug,
			parsedBody.languageId
		);

		const fullBoilerPlate = dbProblem.DefaultCode[0]?.code;

		if (!fullBoilerPlate) {
			return handleError(
				res,
				404,
				'Full boilerplate not found in database'
			);
		}

		const fullCodeWithUserCode = fullBoilerPlate.replace(
			'##USER_CODE_HERE##',
			parsedBody.code
		);

		const problemId = dbProblem.id;
		const userId = req.userId;

		if (!userId) {
			return handleError(res, 400, 'User id is required');
		}

		const language_id = LanguageMapping[parsedBody.languageId]?.judge0;
		if (!language_id) {
			return handleError(res, 400, 'Invalid language ID');
		}

		const submissionsData = problem.inputs.map((input, index) => ({
			language_id: language_id,
			source_code: fullCodeWithUserCode,
			stdin: input,
			expected_output: problem.outputs[index],
			callback_url: JUDGE0_CALLBACK_URL,
		}));

		const batchPromises = [];
		for (let i = 0; i < submissionsData.length; i += CHUNK_SIZE) {
			const chunk = submissionsData.slice(i, i + CHUNK_SIZE);
			batchPromises.push(
				axios.post(
					`${JUDGE_API_URL}/submissions/batch/?base64_encoded=false`,
					{ submissions: chunk }
				)
			);
		}

		const allResponses = await Promise.all(batchPromises);
		const allJudgeResponses = allResponses.flatMap((res) => res.data);

		const submissionResult = await prisma.$transaction(async (tx) => {
			await tx.userProblem.upsert({
				where: {
					userId_problemId: {
						userId,
						problemId,
					},
				},
				create: {
					userId,
					problemId,
					status: ProblemStatus.ATTEMPTED,
				},
				update: {},
			});

			const submission = await tx.submission.create({
				data: {
					userId,
					problemId,
					languageId:
						LanguageMapping[parsedBody.languageId]?.internal ?? 0,
					code: parsedBody.code,
					fullCode: fullCodeWithUserCode,
					status: SubmissionStatus.PENDING,
				},
			});

			await tx.testCase.createMany({
				data: allJudgeResponses.map((resp, index) => ({
					submissionId: submission.id,
					status: TestCaseStatus.PENDING,
					input: problem.inputs[index] ?? '',
					output: problem.outputs[index] ?? '',
					index,
					judge0TrackingId: resp.token,
				})),
			});

			await tx.submission.update({
				where: { id: submission.id },
				data: {
					judge0TrackingIds: allJudgeResponses.map(
						(resp) => resp.token
					),
				},
			});
			return submission.id;
		});
		res.status(200).json({
			submissionId: submissionResult,
			totalTestCases: problem.inputs.length,
			judge0response: allJudgeResponses,
		});
	} catch (error) {
		console.log((error as Error).message);
		return handleError(res, 500, (error as Error).message);
	}
};

export const checkBatchSubmission = async (req: Request, res: Response) => {
	const tokens: string[] = req.body.tokens;

	if (!tokens || tokens.length === 0) {
		return handleError(res, 400, 'Token is required');
	}

	try {
		const results = [];
		for (let i = 0; i < tokens.length; i += CHUNK_SIZE) {
			const chunk = tokens.slice(i, i + CHUNK_SIZE);
			const tokenQuery = chunk.join(',');

			const judge0response = await axios.get(
				`${JUDGE_API_URL}/submissions/batch?tokens=${tokenQuery}&base64_encoded=false`
			);

			results.push(...judge0response.data.submissions);
		}

		res.status(200).json({
			submissions: results,
		});
	} catch (error) {
		console.log(error);
		return handleError(res, 500, (error as Error).message);
	}
};

export const checkSubmission = async (req: Request, res: Response) => {
	const submissionId = req.query.submission_id as string;

	if (!submissionId) {
		return handleError(res, 400, 'Submission id is required');
	}

	try {
		const submission = await prisma.submission.findUnique({
			where: { id: submissionId },
			select: { status: true },
		});

		if (!submission) {
			return handleError(res, 404, 'Submission not found');
		}

		res.status(200).json({ status: submission.status });
	} catch (error) {
		return handleError(res, 500, 'Failed to check submission');
	}
};

export const getUserSubmissions = async (req: Request, res: Response) => {
	// const userId = req.user.id as string;
	const userId = '';
	if (!userId) {
		return handleError(res, 400, 'User id is required');
	}

	const problemSlug = req.params.problemSlug as string;
	if (!problemSlug) {
		return handleError(res, 400, 'Problem slug is required');
	}

	try {
		const submissions = await prisma.submission.findMany({
			where: { userId, Problem: { slug: problemSlug } },
			select: { id: true, status: true },
		});

		if (!submissions) {
			return handleError(res, 404, 'Submission not found');
		}

		res.status(200).json(submissions);
	} catch (error) {
		return handleError(res, 500, 'Failed to get user submissions');
	}
};
