import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export {
	TestCaseStatus,
	SubmissionStatus,
	DefaultCodeType,
	Difficulty,
	ProblemStatus,
} from '@prisma/client';
export default prisma;
