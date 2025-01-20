/*
  Warnings:

  - The values [Easy,Medium,Hard] on the enum `ProblemType` will be removed. If these variants are still used in the database, this will fail.
  - The `status` column on the `Submission` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `difficulty` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Changed the column `type` on the `Problem` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.

*/
-- CreateEnum
CREATE TYPE "SubmissonStatus" AS ENUM ('ACCEPTED', 'PENDING', 'REJECTED');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- AlterEnum
BEGIN;
CREATE TYPE "ProblemType_new" AS ENUM ('Array', 'String', 'HashTable', 'LinkedList');
ALTER TABLE "Problem" ALTER COLUMN "type" TYPE "ProblemType_new"[] USING ("type"::text::"ProblemType_new"[]);
ALTER TYPE "ProblemType" RENAME TO "ProblemType_old";
ALTER TYPE "ProblemType_new" RENAME TO "ProblemType";
DROP TYPE "ProblemType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "difficulty" "Difficulty" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "type" SET DATA TYPE "ProblemType"[];

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "status",
ADD COLUMN     "status" "SubmissonStatus" NOT NULL DEFAULT 'PENDING';
