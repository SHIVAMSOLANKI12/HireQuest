/*
  Warnings:

  - Changed the type of `action` on the `AuditLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `module` on the `AuditLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'PUBLISH', 'UNPUBLISH');

-- CreateEnum
CREATE TYPE "public"."AuditModule" AS ENUM ('AUTH', 'USER', 'ASSESSMENT', 'GAME', 'QUESTION');

-- AlterTable
ALTER TABLE "public"."AuditLog" DROP COLUMN "action",
ADD COLUMN     "action" "public"."AuditAction" NOT NULL,
DROP COLUMN "module",
ADD COLUMN     "module" "public"."AuditModule" NOT NULL;

-- CreateTable
CREATE TABLE "public"."Assessment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "durationMinutes" INTEGER NOT NULL,
    "passingScore" INTEGER NOT NULL,
    "status" "public"."AssessmentStatus" NOT NULL DEFAULT 'DRAFT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Assessment_createdById_idx" ON "public"."Assessment"("createdById");

-- CreateIndex
CREATE INDEX "Assessment_status_idx" ON "public"."Assessment"("status");

-- CreateIndex
CREATE INDEX "Assessment_isActive_idx" ON "public"."Assessment"("isActive");

-- CreateIndex
CREATE INDEX "AuditLog_module_idx" ON "public"."AuditLog"("module");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "public"."AuditLog"("action");

-- AddForeignKey
ALTER TABLE "public"."Assessment" ADD CONSTRAINT "Assessment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
