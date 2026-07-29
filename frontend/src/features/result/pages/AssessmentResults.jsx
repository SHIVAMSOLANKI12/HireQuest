"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import {
  ResultFilters,
  ResultSummary,
  ResultsTable,
} from "../components";
import {
  useAssessmentResults,
  useAssessmentResultSummary,
} from "../hooks";

const AssessmentResults = ({ assessmentId, assessmentTitle }) => {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const {
    data: results = [],
    isLoading,
    isError,
  } = useAssessmentResults(assessmentId);

  const {
    data: summary,
    isLoading: summaryLoading,
  } = useAssessmentResultSummary(assessmentId);

  const filteredResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    return results.filter((result) => {
      const matchesSearch =
        !query ||
        result.candidate.name.toLowerCase().includes(query) ||
        result.candidate.email.toLowerCase().includes(query);

      const matchesStatus = status === "all" || result.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [results, search, status]);

  const handleViewResult = (result) => {
    router.push(`/assessments/${assessmentId}/results/${result.id}`);
  };

  if (isLoading || summaryLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  if (isError || !summary) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Unable to load results</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Assessment Results
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          {assessmentTitle || "Assessment Results"}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Track candidate progress and completed assessment scores.
        </p>
      </div>

      <ResultSummary summary={summary} />

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Candidate Results
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            View candidate status and completed assessment scores.
          </p>
        </div>

        <ResultFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
        />

        <ResultsTable
          results={filteredResults}
          onViewResult={handleViewResult}
        />
      </section>
    </div>
  );
};

export default AssessmentResults;
