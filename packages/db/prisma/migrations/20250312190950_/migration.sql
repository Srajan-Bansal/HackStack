/*
  Warnings:

  - A unique constraint covering the columns `[problemId,languageId,DefaultCodeType]` on the table `DefaultCode` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "DefaultCode_problemId_languageId_key";

-- CreateIndex
CREATE UNIQUE INDEX "DefaultCode_problemId_languageId_DefaultCodeType_key" ON "DefaultCode"("problemId", "languageId", "DefaultCodeType");
