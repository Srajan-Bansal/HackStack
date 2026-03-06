import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export type TransactionClient = Omit<
	PrismaClient,
	'$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

export {
	TestCaseStatus,
	SubmissionStatus,
	DefaultCodeType,
	Difficulty,
	ProblemStatus,
	Prisma,
} from '@prisma/client';
export default prisma;
