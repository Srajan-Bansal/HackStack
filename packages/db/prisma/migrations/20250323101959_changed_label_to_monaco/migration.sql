/*
  Warnings:

  - You are about to drop the column `mode` on the `Language` table. All the data in the column will be lost.
  - Added the required column `monaco` to the `Language` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Language" DROP COLUMN "mode",
ADD COLUMN     "monaco" TEXT NOT NULL;
