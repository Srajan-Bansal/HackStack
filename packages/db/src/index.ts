import { PrismaClient, TestCaseStatus, SubmissionStatus } from '@prisma/client';

const prisma = new PrismaClient();

export { TestCaseStatus, SubmissionStatus };
export default prisma;
