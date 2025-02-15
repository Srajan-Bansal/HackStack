/*
  Warnings:

  - The values [AC,FAIL,TLE] on the enum `TestCaseStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `Memory` on the `Submission` table. All the data in the column will be lost.
  - Added the required column `index` to the `TestCase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TestCaseStatus_new" AS ENUM ('ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'OUTPUT_LIMIT_EXCEEDED', 'COMPILATION_ERROR', 'PENDING');
ALTER TABLE "TestCase" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "TestCase" ALTER COLUMN "status" TYPE "TestCaseStatus_new" USING ("status"::text::"TestCaseStatus_new");
ALTER TYPE "TestCaseStatus" RENAME TO "TestCaseStatus_old";
ALTER TYPE "TestCaseStatus_new" RENAME TO "TestCaseStatus";
DROP TYPE "TestCaseStatus_old";
ALTER TABLE "TestCase" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_userId_fkey";

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "Memory",
ADD COLUMN     "memory" DOUBLE PRECISION,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TestCase" ADD COLUMN     "index" INTEGER NOT NULL,
ALTER COLUMN "memory" SET DATA TYPE DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
