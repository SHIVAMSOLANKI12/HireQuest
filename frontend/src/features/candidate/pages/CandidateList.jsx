"use client";

import { Plus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

import { CandidateTable } from "../components";
import { useCandidatesQuery } from "../hooks";

const CandidateList = () => {
  const {
    data: candidates = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useCandidatesQuery();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Candidates
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage candidates participating in your hiring assessments.
          </p>
        </div>

        <Button type="button">
          <Plus className="mr-2 h-4 w-4" />
          Add Candidate
        </Button>
      </div>

      {isLoading && (
        <div className="rounded-xl border p-12 text-center">
          <p className="text-sm text-muted-foreground">
            Loading candidates...
          </p>
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-destructive/50 p-12 text-center">
          <h2 className="font-semibold">
            Unable to load candidates
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {error?.message || "Something went wrong."}
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => refetch()}
          >
            Try Again
          </Button>
        </div>
      )}

      {!isLoading && !isError && candidates.length === 0 && (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <Users className="mx-auto h-10 w-10 text-muted-foreground" />

          <h2 className="mt-4 text-lg font-semibold">
            No candidates yet
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Add candidates to start your hiring assessment process.
          </p>

          <Button type="button" className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Add Candidate
          </Button>
        </div>
      )}

      {!isLoading && !isError && candidates.length > 0 && (
        <CandidateTable candidates={candidates} />
      )}
    </div>
  );
};

export default CandidateList;
