-- CreateTable
CREATE TABLE "public"."CandidateAssessment" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "status" "public"."CandidateAssessmentStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "startedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidateAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CandidateAnswer" (
    "id" TEXT NOT NULL,
    "candidateAssessmentId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "isCorrect" BOOLEAN,
    "marksAwarded" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CandidateAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AssessmentResult" (
    "id" TEXT NOT NULL,
    "candidateAssessmentId" TEXT NOT NULL,
    "quizScore" INTEGER NOT NULL,
    "totalScore" INTEGER NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "status" "public"."ResultStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssessmentResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CandidateAssessment_candidateId_idx" ON "public"."CandidateAssessment"("candidateId");

-- CreateIndex
CREATE INDEX "CandidateAssessment_assessmentId_idx" ON "public"."CandidateAssessment"("assessmentId");

-- CreateIndex
CREATE INDEX "CandidateAssessment_status_idx" ON "public"."CandidateAssessment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateAssessment_candidateId_assessmentId_key" ON "public"."CandidateAssessment"("candidateId", "assessmentId");

-- CreateIndex
CREATE INDEX "CandidateAnswer_candidateAssessmentId_idx" ON "public"."CandidateAnswer"("candidateAssessmentId");

-- CreateIndex
CREATE INDEX "CandidateAnswer_questionId_idx" ON "public"."CandidateAnswer"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateAnswer_candidateAssessmentId_questionId_key" ON "public"."CandidateAnswer"("candidateAssessmentId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentResult_candidateAssessmentId_key" ON "public"."AssessmentResult"("candidateAssessmentId");

-- AddForeignKey
ALTER TABLE "public"."CandidateAssessment" ADD CONSTRAINT "CandidateAssessment_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandidateAssessment" ADD CONSTRAINT "CandidateAssessment_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "public"."Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandidateAnswer" ADD CONSTRAINT "CandidateAnswer_candidateAssessmentId_fkey" FOREIGN KEY ("candidateAssessmentId") REFERENCES "public"."CandidateAssessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandidateAnswer" ADD CONSTRAINT "CandidateAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AssessmentResult" ADD CONSTRAINT "AssessmentResult_candidateAssessmentId_fkey" FOREIGN KEY ("candidateAssessmentId") REFERENCES "public"."CandidateAssessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
