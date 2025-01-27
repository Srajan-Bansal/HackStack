/*
  Warnings:

  - You are about to drop the column `Memory` on the `TestCase` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `TestCase` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Problem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `DefaultCode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `languageId` to the `DefaultCode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `judgeOId` to the `Language` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Language` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Memory` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Runtime` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `languageId` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `input` to the `TestCase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `output` to the `TestCase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "DefaultCode" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "languageId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Language" ADD COLUMN     "judgeOId" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "Memory" INTEGER NOT NULL,
ADD COLUMN     "Runtime" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "languageId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TestCase" DROP COLUMN "Memory",
DROP COLUMN "time",
ADD COLUMN     "input" TEXT NOT NULL,
ADD COLUMN     "output" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER',
ADD COLUMN     "token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Problem_slug_key" ON "Problem"("slug");

-- CreateIndex
CREATE INDEX "Problem_slug_idx" ON "Problem"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "DefaultCode" ADD CONSTRAINT "DefaultCode_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DefaultCode" ADD CONSTRAINT "DefaultCode_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
