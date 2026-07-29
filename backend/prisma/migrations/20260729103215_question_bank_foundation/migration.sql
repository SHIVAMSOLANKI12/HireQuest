/*
  Warnings:

  - The values [CLOSED] on the enum `AssessmentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `isActive` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `quizScore` on the `AssessmentResult` table. All the data in the column will be lost.
  - You are about to drop the column `totalScore` on the `AssessmentResult` table. All the data in the column will be lost.
  - You are about to drop the column `accuracy` on the `GameResult` table. All the data in the column will be lost.
  - You are about to drop the column `completionTime` on the `GameResult` table. All the data in the column will be lost.
  - You are about to drop the column `playedAt` on the `GameResult` table. All the data in the column will be lost.
  - You are about to drop the column `acceptedAt` on the `Invitation` table. All the data in the column will be lost.
  - You are about to drop the column `invitedById` on the `Invitation` table. All the data in the column will be lost.
  - You are about to drop the column `openedAt` on the `Invitation` table. All the data in the column will be lost.
  - You are about to drop the column `sentAt` on the `Invitation` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `Question` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[questionId,sequence]` on the table `QuestionOption` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `score` to the `AssessmentResult` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `answer` on the `CandidateAnswer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `invitedByUserId` to the `Invitation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `QuestionOption` table without a default value. This is not possible if the table is not empty.
  - Made the column `sequence` on table `QuestionOption` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."AssessmentType" AS ENUM ('TECHNICAL', 'GAMING', 'MIXED');

-- CreateEnum
CREATE TYPE "public"."DifficultyLevel" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "public"."QuestionDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "public"."QuestionStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."AttachmentType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'PDF', 'DOCUMENT', 'CODE', 'ZIP', 'OTHER');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."AssessmentStatus_new" AS ENUM ('DRAFT', 'PUBLISHED', 'ACTIVE', 'ARCHIVED');
ALTER TABLE "public"."Assessment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Assessment" ALTER COLUMN "status" TYPE "public"."AssessmentStatus_new" USING ("status"::text::"public"."AssessmentStatus_new");
ALTER TYPE "public"."AssessmentStatus" RENAME TO "AssessmentStatus_old";
ALTER TYPE "public"."AssessmentStatus_new" RENAME TO "AssessmentStatus";
DROP TYPE "public"."AssessmentStatus_old";
ALTER TABLE "public"."Assessment" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."AuditAction" ADD VALUE 'ARCHIVE';
ALTER TYPE "public"."AuditAction" ADD VALUE 'DUPLICATE';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."QuestionType" ADD VALUE 'TRUE_FALSE';
ALTER TYPE "public"."QuestionType" ADD VALUE 'SHORT_ANSWER';
ALTER TYPE "public"."QuestionType" ADD VALUE 'CODING';
ALTER TYPE "public"."QuestionType" ADD VALUE 'SQL';
ALTER TYPE "public"."QuestionType" ADD VALUE 'PUZZLE';

-- DropForeignKey
ALTER TABLE "public"."Invitation" DROP CONSTRAINT "Invitation_invitedById_fkey";

-- DropIndex
DROP INDEX "public"."Assessment_isActive_idx";

-- DropIndex
DROP INDEX "public"."GameResult_candidateAssessmentId_gameId_key";

-- DropIndex
DROP INDEX "public"."Invitation_token_idx";

-- DropIndex
DROP INDEX "public"."RefreshToken_expiresAt_idx";

-- AlterTable
ALTER TABLE "public"."Assessment" DROP COLUMN "isActive",
ADD COLUMN     "difficulty" "public"."DifficultyLevel" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "endsAt" TIMESTAMP(3),
ADD COLUMN     "maximumScore" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "publishAt" TIMESTAMP(3),
ADD COLUMN     "startsAt" TIMESTAMP(3),
ADD COLUMN     "type" "public"."AssessmentType" NOT NULL DEFAULT 'MIXED';

-- AlterTable
ALTER TABLE "public"."AssessmentGame" ADD COLUMN     "weight" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "public"."AssessmentQuestion" ADD COLUMN     "marks" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "negativeMarks" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."AssessmentResult" DROP COLUMN "quizScore",
DROP COLUMN "totalScore",
ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "score" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."CandidateAnswer" DROP COLUMN "answer",
ADD COLUMN     "answer" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "public"."CandidateAssessment" ADD COLUMN     "attemptNumber" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "public"."GameResult" DROP COLUMN "accuracy",
DROP COLUMN "completionTime",
DROP COLUMN "playedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "metrics" JSONB;

-- AlterTable
ALTER TABLE "public"."Invitation" DROP COLUMN "acceptedAt",
DROP COLUMN "invitedById",
DROP COLUMN "openedAt",
DROP COLUMN "sentAt",
ADD COLUMN     "invitedByUserId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Question" DROP COLUMN "question",
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "difficulty" "public"."QuestionDifficulty" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "estimatedTime" INTEGER,
ADD COLUMN     "explanation" TEXT,
ADD COLUMN     "negativeMarks" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "shuffleOptions" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "status" "public"."QuestionStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updatedById" TEXT,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "type" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."QuestionOption" ADD COLUMN     "explanation" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "sequence" SET NOT NULL;

-- CreateTable
CREATE TABLE "public"."PasswordResetToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QuestionCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QuestionTag" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QuestionAttachment" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "type" "public"."AttachmentType" NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QuestionVersion" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "snapshot" JSONB NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QuestionAuditLog" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" "public"."AuditAction" NOT NULL,
    "oldValue" JSONB,
    "newValue" JSONB,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "public"."PasswordResetToken"("tokenHash");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_idx" ON "public"."PasswordResetToken"("userId");

-- CreateIndex
CREATE INDEX "PasswordResetToken_expiresAt_idx" ON "public"."PasswordResetToken"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionCategory_name_key" ON "public"."QuestionCategory"("name");

-- CreateIndex
CREATE INDEX "QuestionCategory_isActive_idx" ON "public"."QuestionCategory"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "public"."Tag"("name");

-- CreateIndex
CREATE INDEX "Tag_isActive_idx" ON "public"."Tag"("isActive");

-- CreateIndex
CREATE INDEX "QuestionTag_questionId_idx" ON "public"."QuestionTag"("questionId");

-- CreateIndex
CREATE INDEX "QuestionTag_tagId_idx" ON "public"."QuestionTag"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionTag_questionId_tagId_key" ON "public"."QuestionTag"("questionId", "tagId");

-- CreateIndex
CREATE INDEX "QuestionAttachment_questionId_idx" ON "public"."QuestionAttachment"("questionId");

-- CreateIndex
CREATE INDEX "QuestionAttachment_type_idx" ON "public"."QuestionAttachment"("type");

-- CreateIndex
CREATE INDEX "QuestionVersion_questionId_idx" ON "public"."QuestionVersion"("questionId");

-- CreateIndex
CREATE INDEX "QuestionVersion_createdById_idx" ON "public"."QuestionVersion"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionVersion_questionId_version_key" ON "public"."QuestionVersion"("questionId", "version");

-- CreateIndex
CREATE INDEX "QuestionAuditLog_questionId_idx" ON "public"."QuestionAuditLog"("questionId");

-- CreateIndex
CREATE INDEX "QuestionAuditLog_userId_idx" ON "public"."QuestionAuditLog"("userId");

-- CreateIndex
CREATE INDEX "QuestionAuditLog_action_idx" ON "public"."QuestionAuditLog"("action");

-- CreateIndex
CREATE INDEX "Assessment_type_idx" ON "public"."Assessment"("type");

-- CreateIndex
CREATE INDEX "Assessment_difficulty_idx" ON "public"."Assessment"("difficulty");

-- CreateIndex
CREATE INDEX "AssessmentQuestion_sequence_idx" ON "public"."AssessmentQuestion"("sequence");

-- CreateIndex
CREATE INDEX "AssessmentResult_status_idx" ON "public"."AssessmentResult"("status");

-- CreateIndex
CREATE INDEX "Invitation_invitedByUserId_idx" ON "public"."Invitation"("invitedByUserId");

-- CreateIndex
CREATE INDEX "Question_difficulty_idx" ON "public"."Question"("difficulty");

-- CreateIndex
CREATE INDEX "Question_status_idx" ON "public"."Question"("status");

-- CreateIndex
CREATE INDEX "Question_categoryId_idx" ON "public"."Question"("categoryId");

-- CreateIndex
CREATE INDEX "Question_createdById_idx" ON "public"."Question"("createdById");

-- CreateIndex
CREATE INDEX "Question_updatedById_idx" ON "public"."Question"("updatedById");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionOption_questionId_sequence_key" ON "public"."QuestionOption"("questionId", "sequence");

-- AddForeignKey
ALTER TABLE "public"."PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."QuestionCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuestionTag" ADD CONSTRAINT "QuestionTag_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuestionTag" ADD CONSTRAINT "QuestionTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuestionAttachment" ADD CONSTRAINT "QuestionAttachment_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuestionVersion" ADD CONSTRAINT "QuestionVersion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuestionVersion" ADD CONSTRAINT "QuestionVersion_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuestionAuditLog" ADD CONSTRAINT "QuestionAuditLog_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuestionAuditLog" ADD CONSTRAINT "QuestionAuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invitation" ADD CONSTRAINT "Invitation_invitedByUserId_fkey" FOREIGN KEY ("invitedByUserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
