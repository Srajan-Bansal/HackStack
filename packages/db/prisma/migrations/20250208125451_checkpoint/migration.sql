/*
  Warnings:

  - The values [ACCEPTED] on the enum `SubmissionStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [SUCCESS,FAILED] on the enum `TestCaseStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `statement` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `Runtime` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `problemId` on the `TestCase` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[problemId,languageId]` on the table `DefaultCode` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[judge0TrackingId]` on the table `TestCase` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `DefaultCode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Language` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullCode` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `judge0TrackingId` to the `TestCase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TestCase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SubmissionStatus_new" AS ENUM ('SUCCESS', 'PENDING', 'REJECTED');
ALTER TABLE "Submission" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Submission" ALTER COLUMN "status" TYPE "SubmissionStatus_new" USING ("status"::text::"SubmissionStatus_new");
ALTER TYPE "SubmissionStatus" RENAME TO "SubmissionStatus_old";
ALTER TYPE "SubmissionStatus_new" RENAME TO "SubmissionStatus";
DROP TYPE "SubmissionStatus_old";
ALTER TABLE "Submission" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TestCaseStatus_new" AS ENUM ('AC', 'FAIL', 'TLE', 'COMPILATION_ERROR', 'PENDING');
ALTER TABLE "TestCase" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "TestCase" ALTER COLUMN "status" TYPE "TestCaseStatus_new" USING ("status"::text::"TestCaseStatus_new");
ALTER TYPE "TestCaseStatus" RENAME TO "TestCaseStatus_old";
ALTER TYPE "TestCaseStatus_new" RENAME TO "TestCaseStatus";
DROP TYPE "TestCaseStatus_old";
ALTER TABLE "TestCase" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "TestCase" DROP CONSTRAINT "TestCase_problemId_fkey";

-- AlterTable
ALTER TABLE "DefaultCode" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Language" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "statement",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "hidden" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "Runtime",
ADD COLUMN     "fullCode" TEXT NOT NULL,
ADD COLUMN     "runtime" DOUBLE PRECISION,
ALTER COLUMN "Memory" DROP NOT NULL,
ALTER COLUMN "Memory" DROP DEFAULT;

-- AlterTable
ALTER TABLE "TestCase" DROP COLUMN "problemId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "judge0TrackingId" TEXT NOT NULL,
ADD COLUMN     "memory" INTEGER,
ADD COLUMN     "runtime" DOUBLE PRECISION,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DefaultCode_problemId_languageId_key" ON "DefaultCode"("problemId", "languageId");

-- CreateIndex
CREATE UNIQUE INDEX "TestCase_judge0TrackingId_key" ON "TestCase"("judge0TrackingId");
