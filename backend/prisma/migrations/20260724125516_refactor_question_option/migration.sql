/*
  Warnings:

  - You are about to drop the column `correctAnswer` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `optionA` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `optionB` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `optionC` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `optionD` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Question" DROP COLUMN "correctAnswer",
DROP COLUMN "optionA",
DROP COLUMN "optionB",
DROP COLUMN "optionC",
DROP COLUMN "optionD";

-- CreateTable
CREATE TABLE "public"."QuestionOption" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "optionText" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "sequence" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuestionOption_questionId_idx" ON "public"."QuestionOption"("questionId");

-- AddForeignKey
ALTER TABLE "public"."QuestionOption" ADD CONSTRAINT "QuestionOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
