"use client";

import { useRouter } from "next/navigation";

import { AssessmentLanding } from "../components";
import {
  useAssignmentAttemptQuery,
  useInvitationQuery,
  useStartAttempt,
} from "../hooks";

const AssessmentInvitation = ({ token }) => {
  const router = useRouter();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useInvitationQuery(token);

  // Check for an existing attempt once assignment id is known
  const assignmentId = data?.assignment?.id;
  const { data: existingAttempt } = useAssignmentAttemptQuery(assignmentId);

  const startAttempt = useStartAttempt();

  const handleStart = () => {
    // If attempt already exists — just navigate, don't create a new one
    if (existingAttempt) {
      router.push(`/assessment/attempt/${existingAttempt.id}`);
      return;
    }

    const { assignment, candidate, assessment } = data;

    startAttempt.mutate(
      {
        assignmentId: assignment.id,
        candidateId: candidate.id,
        assessmentId: assessment.id,
      },
      {
        onSuccess: (attempt) => {
          router.push(`/assessment/attempt/${attempt.id}`);
        },
      }
    );
  };

  // ── Loading ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading assessment...
        </p>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────
  if (isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-2xl font-semibold">Invitation Unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {error?.message ||
              "This assessment invitation is invalid or unavailable."}
          </p>
        </div>
      </div>
    );
  }

  const { assignment, candidate, assessment } = data;

  return (
    <>
      <AssessmentLanding
        candidate={candidate}
        assessment={assessment}
        assignment={assignment}
        onStart={handleStart}
        isStarting={startAttempt.isPending}
        hasAttempt={Boolean(existingAttempt)}
      />

      {startAttempt.isError && (
        <div className="mx-auto mb-10 max-w-3xl px-4">
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
            <p className="text-sm text-destructive">
              {startAttempt.error?.message ||
                "Unable to start assessment. Please try again."}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AssessmentInvitation;
