"use client";

import { Loader2, AlertCircle } from "lucide-react";

import { AssessmentRuntime } from "../components";
import { useAttemptQuery, useAssessmentQuery } from "../hooks";

const AssessmentAttempt = ({ attemptId }) => {
  const {
    data: attempt,
    isLoading: attemptLoading,
    isError: attemptError,
  } = useAttemptQuery(attemptId);

  // assessmentId only available once attempt loads
  const {
    data: assessment,
    isLoading: assessmentLoading,
    isError: assessmentError,
  } = useAssessmentQuery(attempt?.assessmentId);

  // ── Loading ──────────────────────────────────────────────
  if (attemptLoading || assessmentLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading assessment...</p>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────
  if (attemptError || assessmentError || !attempt || !assessment) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>
          <h1 className="text-2xl font-semibold">Assessment unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This assessment attempt could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  // ── Runtime Engine ───────────────────────────────────────
  return (
    <AssessmentRuntime
      assessment={assessment}
      attempt={attempt}
      onReview={() => {
        // Sprint 8.11: navigate to review/submit screen
        console.log("Open review — attempt:", attempt.id);
      }}
    />
  );
};

export default AssessmentAttempt;
