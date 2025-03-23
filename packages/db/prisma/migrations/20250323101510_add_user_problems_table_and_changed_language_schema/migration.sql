/*
  Warnings:

  - You are about to drop the column `judgeOId` on the `Language` table. All the data in the column will be lost.
  - Added the required column `fileExtension` to the `Language` table without a default value. This is not possible if the table is not empty.
  - Added the required column `judge0Id` to the `Language` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mode` to the `Language` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProblemStatus" AS ENUM ('NOT_ATTEMPTED', 'ATTEMPTED', 'SOLVED');

-- AlterTable
ALTER TABLE "Language" DROP COLUMN "judgeOId",
ADD COLUMN     "fileExtension" TEXT NOT NULL,
ADD COLUMN     "judge0Id" INTEGER NOT NULL,
ADD COLUMN     "mode" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "UserProblem" (
    "id" TEXT NOT NULL,
    "status" "ProblemStatus" NOT NULL DEFAULT 'NOT_ATTEMPTED',
    "userId" TEXT NOT NULL,
    "problemId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProblem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProblem_userId_problemId_key" ON "UserProblem"("userId", "problemId");

-- AddForeignKey
ALTER TABLE "UserProblem" ADD CONSTRAINT "UserProblem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProblem" ADD CONSTRAINT "UserProblem_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
