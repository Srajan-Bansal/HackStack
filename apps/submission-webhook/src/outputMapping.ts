import { TestCaseStatus } from '@repo/db/client';

export const outMapping: Record<string, TestCaseStatus> = {
	Accepted: TestCaseStatus.ACCEPTED,
	'Wrong Answer': TestCaseStatus.WRONG_ANSWER,
	'Time Limit Exceeded': TestCaseStatus.TIME_LIMIT_EXCEEDED,
	'Memory Limit Exceeded': TestCaseStatus.MEMORY_LIMIT_EXCEEDED,
	'Runtime Error': TestCaseStatus.RUNTIME_ERROR,
	'Output Limit Exceeded': TestCaseStatus.OUTPUT_LIMIT_EXCEEDED,
	'Compilation Error': TestCaseStatus.COMPILATION_ERROR,
	Pending: TestCaseStatus.PENDING,
};
