import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export {
	TestCaseStatus,
	SubmissionStatus,
	DefaultCodeType,
	Difficulty,
} from '@prisma/client';
export default prisma;
