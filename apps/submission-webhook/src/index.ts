import express, { Request, Response } from 'express';
import morgan from 'morgan';
import prisma, { SubmissionStatus, ProblemStatus } from '@repo/db/client';
import { SubmissionCallback } from '@repo/common-zod/types';
import { outMapping } from './outputMapping';

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.put('/submissions-callback', async (req: Request, res: Response) => {
	try {
		const parsedBody = SubmissionCallback.parse(req.body);
		if (!parsedBody) {
			res.status(400).json({ error: 'Invalid request body' });
		}

		const mappedStatus = outMapping[parsedBody.status.description];
		if (!mappedStatus) {
			res.status(400).json({ error: 'Unknown Judge0 status' });
		}

		const updatedTestCase = await prisma.testCase.update({
			where: { judge0TrackingId: parsedBody.token },
			data: {
				status: mappedStatus,
				runtime: parseFloat(parsedBody.time),
				memory: parsedBody.memory,
			},
			select: { submissionId: true },
		});

		if (!updatedTestCase) {
			res.status(404).json({ error: 'Test case not found' });
		}

		const allTestCases = await prisma.testCase.findMany({
			where: { submissionId: updatedTestCase.submissionId },
		});

		const submissionId = updatedTestCase.submissionId;
		if (!submissionId) {
			throw new Error('Submission ID is null');
		}

		const hasPending = allTestCases.some(
			(tc) => tc.status === outMapping['Pending']
		);
		const hasFailures = allTestCases.some(
			(tc) => tc.status !== outMapping['Accepted']
		);

		if (!hasPending) {
			await prisma.$transaction(async (tx) => {
				const submission = await tx.submission.update({
					where: { id: submissionId },
					data: {
						status: hasFailures
							? SubmissionStatus.REJECTED
							: SubmissionStatus.SUCCESS,
						runtime: Math.max(
							...allTestCases.map((tc) => tc.runtime ?? 0)
						),
						memory: Math.max(
							...allTestCases.map((tc) => tc.memory ?? 0)
						),
					},
					select: {
						userId: true,
						problemId: true,
						status: true,
					},
				});

				if (!submission.userId || !submission.problemId) {
					throw new Error('Submission missing userId or problemId');
				}

				const existing = await tx.userProblem.findUnique({
					where: {
						userId_problemId: {
							userId: submission.userId,
							problemId: submission.problemId,
						},
					},
				});

				if (existing) {
					const newStatus =
						submission.status === SubmissionStatus.SUCCESS
							? ProblemStatus.SOLVED
							: existing.status === ProblemStatus.NOT_ATTEMPTED
								? ProblemStatus.ATTEMPTED
								: existing.status;

					if (newStatus !== existing.status) {
						await tx.userProblem.update({
							where: {
								userId_problemId: {
									userId: submission.userId,
									problemId: submission.problemId,
								},
							},
							data: {
								status: newStatus,
								updatedAt: new Date(),
							},
						});
					}
				} else {
					await tx.userProblem.create({
						data: {
							userId: submission.userId,
							problemId: submission.problemId,
							status:
								submission.status === SubmissionStatus.SUCCESS
									? ProblemStatus.SOLVED
									: ProblemStatus.ATTEMPTED,
						},
					});
				}
			});
		}

		res.status(200).json({
			message: 'Test case updated successfully',
		});
	} catch (error) {
		console.error('Error processing submission callback:', error);
		res.status(500).json({
			error: 'Internal Server Error',
			details: error instanceof Error ? error.message : String(error),
		});
	}
});

app.get('/', (req: Request, res: Response) => {
	res.send('Hello World!');
});

app.listen(5000, '0.0.0.0', () => {
	console.log(`Server is running on port 5000`);
});
