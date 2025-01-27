/*
  Warnings:

  - The `status` column on the `Submission` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('ACCEPTED', 'PENDING', 'REJECTED');

-- DropForeignKey
ALTER TABLE "TestCase" DROP CONSTRAINT "TestCase_submissionId_fkey";

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "status",
ADD COLUMN     "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "Memory" SET DEFAULT 0,
ALTER COLUMN "Runtime" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "TestCase" ALTER COLUMN "submissionId" DROP NOT NULL;

-- DropEnum
DROP TYPE "SubmissonStatus";

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
