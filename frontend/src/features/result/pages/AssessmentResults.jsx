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
import { rankCandidateResults } from "../utils";

const AssessmentResults = ({ assessmentId, assessmentTitle }) => {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [decision, setDecision] = useState("all");

  const {
    data: results = [],
    isLoading,
    isError,
  } = useAssessmentResults(assessmentId);

  const {
    data: summary,
    isLoading: summaryLoading,
  } = useAssessmentResultSummary(assessmentId);

  const rankedResults = useMemo(() => {
    return rankCandidateResults(results);
  }, [results]);

  const filteredResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rankedResults.filter((result) => {
      const matchesSearch =
        !query ||
        result.candidate.name.toLowerCase().includes(query) ||
        result.candidate.email.toLowerCase().includes(query);

      const matchesStatus = status === "all" || result.status === status;
      const matchesDecision =
        decision === "all" || (result.decision ?? "Pending") === decision;

      return matchesSearch && matchesStatus && matchesDecision;
    });
  }, [rankedResults, search, status, decision]);

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
          Track candidate progress, scores, rankings, and shortlisting decisions.
        </p>
      </div>

      <ResultSummary summary={summary} />

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Candidate Results
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            View candidate rankings, assessment scores, and hiring decisions.
          </p>
        </div>

        <ResultFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          decision={decision}
          onDecisionChange={setDecision}
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
