import { Request, Response } from 'express';
import prisma from '@repo/db/client';
import axios from 'axios';
import { SubmissionInputSchema } from '@repo/common-zod/types';

const JUDGE_API_URL = process.env.JUDGE_API_URL || 'http://localhost:2358';

export const createSubmission = async (req: Request, res: Response) => {
	const parsedBody = SubmissionInputSchema.parse(req.body);

	const problemId = parsedBody.problemId;
	const testcases = await prisma.testCase.findMany({
		where: { problemId: problemId },
		select: { id: true, input: true, output: true },
	});

	const SubmissionCode = JSON.stringify(parsedBody.code);

	const judge0request = await axios.post(`${JUDGE_API_URL}/judge`, {
		submissions: testcases.map((testcase) => ({
			language_id: parsedBody.languageId,
			source_code: SubmissionCode,
			stdin: JSON.stringify(testcase.input),
			expected_output: JSON.stringify(testcase.output),
		})),
	});

	res.json(judge0request);
};
