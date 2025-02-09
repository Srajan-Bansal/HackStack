import express, { type Request, type Response } from 'express';
import morgan from 'morgan';
import prisma, { SubmissionStatus } from '@repo/db/client';
import { SubmissionCallback } from '@repo/common-zod/types';
import { outMapping } from './outputMapping';

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.post('/submissions-callback', async (req: Request, res: Response) => {
	try {
		const parsedBody = SubmissionCallback.parse(req.body);

		const testCase = await prisma.testCase.update({
			where: { judge0TrackingId: parsedBody.data.token },
			data: {
				status: { set: outMapping[parsedBody.data.status.description] },
				runtime: parseFloat(parsedBody.data.time),
				memory: parsedBody.data.memory,
			},
			select: { submissionId: true },
		});

		if (!testCase) {
			res.status(404).json({ error: 'Test case not found' });
		}

		const allTestCases = await prisma.testCase.findMany({
			where: { submissionId: testCase.submissionId },
		});

		if (!testCase.submissionId) {
			throw new Error('Submission ID is null');
		}

		const pendingTestCases = allTestCases.some(
			(tc) => tc.status === outMapping['Pending']
		);
		const failedTestCases = allTestCases.some(
			(tc) => tc.status !== outMapping['Accepted']
		);

		if (!pendingTestCases) {
			const accepted = !failedTestCases;
			await prisma.submission.update({
				where: { id: testCase.submissionId },
				data: {
					status: accepted
						? SubmissionStatus.SUCCESS
						: SubmissionStatus.REJECTED,
					runtime: Math.max(
						...allTestCases.map((tc) => tc.runtime ?? 0)
					),
					memory: Math.max(
						...allTestCases.map((tc) => tc.memory ?? 0)
					),
				},
			});
		}

		res.status(200).json({ message: 'Test case updated successfully' });
	} catch (error) {
		console.error('Error updating test case:', error);
		res.status(500).json({
			error: 'Internal Server Error',
			details: error,
		});
	}
});

app.listen(5000, () => {
	console.log('Server is running on port 5000');
});
