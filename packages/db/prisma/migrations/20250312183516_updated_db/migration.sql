/*
  Warnings:

  - You are about to drop the column `token` on the `User` table. All the data in the column will be lost.
  - Added the required column `DefaultCodeType` to the `DefaultCode` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DefaultCodeType" AS ENUM ('FULLBOILERPLATECODE', 'PARTIALBOILERPLATECODE');

-- AlterTable
ALTER TABLE "DefaultCode" ADD COLUMN     "DefaultCodeType" "DefaultCodeType" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "token",
ADD COLUMN     "provider" TEXT;
