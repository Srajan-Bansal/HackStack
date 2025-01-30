import { Request, Response } from 'express';
import prisma from '@repo/db/client';
import axios from 'axios';
import { SubmissionInputSchema } from '@repo/common-zod/types';
import { handleError } from '../utils/errorHandler';
import { LanguageMapping } from '@repo/language/LanguageMapping';

const JUDGE_API_URL = process.env.JUDGE_API_URL || 'http://localhost:2358';

export const createBatchSubmission = async (req: Request, res: Response) => {
	const parsedBody = SubmissionInputSchema.parse(req.body);

	const parsedLanguageId = LanguageMapping.find(
		(language) => language.id === parsedBody.languageId
	);

	if (!parsedLanguageId) {
		return handleError(res, 400, 'Invalid language id');
	}

	const problemSlug = req.params.problemSlug as string;

	const problem = await prisma.problem.findFirst({
		where: { slug: problemSlug },
		select: { id: true },
	});

	if (!problem) {
		return handleError(res, 404, 'Problem not found');
	}

	const testcases = await prisma.testCase.findMany({
		where: { problemId: problem.id },
		select: { id: true, input: true, output: true },
	});

	const SubmissionCode = parsedBody.code.trim();

	const judge0response = await axios.post(
		`${JUDGE_API_URL}/submissions/batch/?base64_encoded=false`,
		{
			submissions: testcases.map((testcase) => ({
				language_id: parsedBody.languageId,
				source_code: SubmissionCode,
				stdin: testcase.input.trim(),
				expected_output: testcase.output.trim(),
			})),
		}
	);

	if (!judge0response) {
		return handleError(res, 500, 'Failed to submit solution');
	}

	res.status(200).json(judge0response.data);
};

export const checkBatchSubmission = async (req: Request, res: Response) => {
	const tokens: string[] = req.body.tokens;

	if (!tokens || tokens.length === 0) {
		return handleError(res, 400, 'Token is required');
	}
	const getSubmissionsRequest = tokens
		.map((token) => `token=${token}`)
		.join('&');

	const judge0response = await axios.get(
		`${JUDGE_API_URL}/submissions/batch?${getSubmissionsRequest}&base64_encoded=false`
	);

	if (!judge0response) {
		return handleError(res, 500, 'Failed to get submissions');
	}

	res.status(200).json(judge0response.data);
};
