import { consumer } from './kafka.config';
import prisma, { SubmissionStatus, ProblemStatus, TestCaseStatus } from '@repo/db/client';

interface ExecutorResponse {
	status: 'SUCCESS' | 'ERROR';
	data: string | string[];
	errorList: string | string[];
	submissionId: string;
	userId: string;
	problemId: number;
}

class ExecutorConsumer {
	async start() {
		await consumer.connect();
		console.log('📡 Kafka consumer connected to code-results topic');

		await consumer.subscribe({ topic: 'code-results', fromBeginning: false });
		console.log('✅ Subscribed to code-results topic');

		await consumer.run({
			eachMessage: async ({ topic, partition, message }) => {
				try {
					if (!message.value) {
						console.error('❌ Received empty message');
						return;
					}

					const rawMessage = message.value.toString();
					console.log(`📩 Raw message received: ${rawMessage}`);
					const result: ExecutorResponse = JSON.parse(rawMessage);
					console.log(`📥 Parsed result:`, JSON.stringify(result, null, 2));
					console.log(`📥 Processing result for submission: ${result.submissionId}`);

					await this.processExecutionResult(result);
				} catch (error) {
					console.error('❌ Error processing message:', error);
				}
			},
		});
	}

	private async processExecutionResult(result: ExecutorResponse) {
		try {
			if (result.status === 'ERROR') {
				await this.handleError(result);
			} else {
				await this.handleSuccess(result);
			}
		} catch (error) {
			console.error('❌ Error in processExecutionResult:', error);
			throw error;
		}
	}

	private async handleError(result: ExecutorResponse) {
		const errorMessage = Array.isArray(result.errorList) ? result.errorList.join('\n') : result.errorList;

		let testCaseStatus: TestCaseStatus = TestCaseStatus.RUNTIME_ERROR;

		if (errorMessage.toLowerCase().includes('compilation error')) {
			testCaseStatus = TestCaseStatus.COMPILATION_ERROR;
		} else if (errorMessage.toLowerCase().includes('time limit')) {
			testCaseStatus = TestCaseStatus.TIME_LIMIT_EXCEEDED;
		} else if (errorMessage.toLowerCase().includes('memory limit')) {
			testCaseStatus = TestCaseStatus.MEMORY_LIMIT_EXCEEDED;
		}

		await prisma.$transaction(async (tx) => {
			await tx.testCase.updateMany({
				where: { submissionId: result.submissionId },
				data: { status: testCaseStatus },
			});

			await tx.submission.update({
				where: { id: result.submissionId },
				data: { status: SubmissionStatus.REJECTED },
			});

			await this.updateUserProblemStatus(
				tx,
				result.userId,
				result.problemId,
				SubmissionStatus.REJECTED
			);
		});

		console.log(`✅ Updated submission ${result.submissionId} with error status`);
	}

	private async handleSuccess(result: ExecutorResponse) {
		await prisma.$transaction(async (tx) => {
			const testCases = await tx.testCase.findMany({
				where: { submissionId: result.submissionId },
				orderBy: { index: 'asc' },
			});

			const results = Array.isArray(result.data) ? result.data : [result.data];
			const executedCount = results.length;

			const passedTestCaseIds: string[] = [];
			const failedTestCaseIds: string[] = [];

			for (let i = 0; i < executedCount && i < testCases.length; i++) {
				const testResult = results[i];
				const isPassed = testResult?.includes('passed');

				if (isPassed) {
					passedTestCaseIds.push(testCases[i]!.id);
				} else {
					let errorStatus: TestCaseStatus = TestCaseStatus.WRONG_ANSWER;
					if (testResult?.toLowerCase().includes('runtime error')) {
						errorStatus = TestCaseStatus.RUNTIME_ERROR;
					} else if (testResult?.toLowerCase().includes('time limit')) {
						errorStatus = TestCaseStatus.TIME_LIMIT_EXCEEDED;
					} else if (testResult?.toLowerCase().includes('memory')) {
						errorStatus = TestCaseStatus.MEMORY_LIMIT_EXCEEDED;
					}

					failedTestCaseIds.push(testCases[i]!.id);

					await tx.testCase.update({
						where: { id: testCases[i]!.id },
						data: { status: errorStatus },
					});
				}
			}

			if (passedTestCaseIds.length > 0) {
				await tx.testCase.updateMany({
					where: { id: { in: passedTestCaseIds } },
					data: { status: TestCaseStatus.ACCEPTED },
				});
			}

			const allExecutedPassed = results.every(r => r && r.includes('passed'));
			const allTestCasesExecuted = executedCount === testCases.length;
			const submissionStatus = (allExecutedPassed && allTestCasesExecuted) ? SubmissionStatus.SUCCESS : SubmissionStatus.REJECTED;

			await tx.submission.update({
				where: { id: result.submissionId },
				data: { status: submissionStatus },
			});

			await this.updateUserProblemStatus(
				tx,
				result.userId,
				result.problemId,
				submissionStatus
			);
		});

		console.log(`✅ Updated submission ${result.submissionId} successfully`);
	}

	private async updateUserProblemStatus(tx: any, userId: string, problemId: number, submissionStatus: SubmissionStatus) {
		const existing = await tx.userProblem.findUnique({
			where: {
				userId_problemId: {
					userId,
					problemId,
				},
			},
		});

		if (existing) {
			const newStatus = submissionStatus === SubmissionStatus.SUCCESS
				? ProblemStatus.SOLVED
				: existing.status === ProblemStatus.NOT_ATTEMPTED ? ProblemStatus.ATTEMPTED : existing.status;

			if (newStatus !== existing.status) {
				await tx.userProblem.update({
					where: {
						userId_problemId: {
							userId,
							problemId,
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
					userId,
					problemId,
					status: submissionStatus === SubmissionStatus.SUCCESS ? ProblemStatus.SOLVED : ProblemStatus.ATTEMPTED,
				},
			});
		}
	}

	async stop() {
		await consumer.disconnect();
		console.log('🔌 Kafka consumer disconnected');
	}
}

// Start the consumer
const executorConsumer = new ExecutorConsumer();

const startConsumer = async () => {
	try {
		await executorConsumer.start();
	} catch (error) {
		console.error('❌ Failed to start consumer:', error);
		process.exit(1);
	}
};

// Graceful shutdown
const shutdown = async () => {
	console.log('\n🛑 Shutting down gracefully...');
	await executorConsumer.stop();
	await prisma.$disconnect();
	process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

startConsumer();
