"use client";

import { useInvitationQuery } from "../hooks";

const CandidateInvitation = ({ token }) => {
  const {
    data: invitation,
    isLoading,
    isError,
  } = useInvitationQuery(token);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Loading assessment...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl p-8 text-center">
        <h1 className="text-2xl font-semibold">
          Invitation unavailable
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          This assessment invitation is invalid or unavailable.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-8">
      <div className="rounded-xl border p-8 shadow-sm">
        <p className="text-sm text-muted-foreground font-medium">
          Assessment Invitation
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Your assessment is ready
        </h1>

        <p className="mt-3 text-sm text-muted-foreground">
          Review the instructions before starting your assessment.
        </p>

        <div className="mt-6 rounded-lg bg-muted p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            Invitation Status
          </p>

          <p className="mt-1 font-medium text-foreground">
            {invitation.status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CandidateInvitation;
