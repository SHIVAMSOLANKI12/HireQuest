"use client";

import { useMemo } from "react";
import { Loader2 } from "lucide-react";

import {
  HiringPipeline,
  PipelineCandidateTable,
  PipelineStats,
} from "../components";
import { useHiringProcess, usePipelineCandidates } from "../hooks";
import { getPipelineStats } from "../utils";

const HiringProcessDetail = ({ hiringProcessId }) => {
  const {
    data: process,
    isLoading: processLoading,
    isError: processError,
  } = useHiringProcess(hiringProcessId);

  const {
    data: candidates = [],
    isLoading: candidatesLoading,
    isError: candidatesError,
  } = usePipelineCandidates(hiringProcessId);

  const stats = useMemo(
    () => getPipelineStats({ process, candidates }),
    [process, candidates]
  );

  if (processLoading || candidatesLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading hiring process...
          </p>
        </div>
      </div>
    );
  }

  if (processError || candidatesError || !process) {
    return (
      <div className="flex min-h-[400px] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h2 className="text-xl font-semibold text-slate-900">
            Hiring process unavailable
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Unable to load hiring process details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Hiring Process
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          {process.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Position: <span className="font-semibold text-slate-800">{process.position}</span>
        </p>
      </div>

      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Recruitment Rounds Pipeline
        </h2>
        <HiringPipeline rounds={process.rounds} />
      </section>

      <PipelineStats stats={stats} />

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Candidate Pipeline
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Track candidate progress across recruitment rounds.
          </p>
        </div>

        <PipelineCandidateTable
          candidates={candidates}
          rounds={process.rounds}
        />
      </section>
    </div>
  );
};

export default HiringProcessDetail;
