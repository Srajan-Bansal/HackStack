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

	console.log(testcases);

	testcases.forEach((testcase) => {
		console.log(testcase.input.trim());
		console.log(testcase.output.trim());
	});

	const SubmissionCode = parsedBody.code.trim();

	let judge0response;
	try {
		judge0response = await axios.post(
			`${JUDGE_API_URL}/submissions/batch/?base64_encoded=false`,
			{
				submissions: testcases.map((testcase) => ({
					language_id: parsedBody.languageId,
					source_code: SubmissionCode,
					stdin: testcase.input.trim(),
					expected_output: JSON.stringify(testcase.output.trim()),
					callback_url: 'http://localhost:5000/submissions-callback',
				})),
			}
		);
	} catch (error) {
		return handleError(res, 500, 'Failed to submit solution');
	}

	res.status(200).json(judge0response.data);
};

export const checkBatchSubmission = async (req: Request, res: Response) => {
	const tokens: [{ token: string }] = req.body.tokens;

	if (!tokens) {
		return handleError(res, 400, 'Token is required');
	}

	let getSubmissionsRequest = 'tokens=';
	getSubmissionsRequest += tokens.map((x) => `${x.token}`).join(',');

	let judge0response;
	try {
		judge0response = await axios.get(
			`${JUDGE_API_URL}/submissions/batch?${getSubmissionsRequest}&base64_encoded=false`
		);
	} catch (error) {
		return handleError(res, 500, (error as Error).message);
	}

	res.status(200).json(judge0response.data);
};

// export const checkSubmission = async (req: Request, res: Response) => {
// 	const submissionId = req.query.submission_id as string;

// 	if (!submissionId) {
// 		res.status(400).json({ error: 'Submission id is required' });
// 	}

// 	try {
// 		const submission = await prisma.submission.findUnique({
// 			where: { id: submissionId },
// 			select: { status: true },
// 		});

// 		if (!submission) {
// 			res.status(404).json({ error: 'Submission not found' });
// 		}

// 		res.status(200).json({ status: submission?.status });
// 	} catch (error) {
// 		res.status(500).json({ error: 'Failed to check submission' });
// 	}
// };
