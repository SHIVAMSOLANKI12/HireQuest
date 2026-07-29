"use client";

import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  HiringPipeline,
  NextRoundAction,
  PipelineCandidateTable,
  PipelineStats,
} from "../components";
import {
  useAdvanceHiringRound,
  useHiringProcess,
  usePipelineCandidates,
} from "../hooks";
import {
  getActiveRound,
  getEligibleCandidates,
  getNextRound,
  getPipelineStats,
} from "../utils";

const HiringProcessDetail = ({ hiringProcessId }) => {
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);

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

  const advanceRound = useAdvanceHiringRound();

  const activeRound = useMemo(
    () => getActiveRound(process?.rounds),
    [process]
  );

  const nextRound = useMemo(
    () =>
      getNextRound({
        rounds: process?.rounds ?? [],
        currentRoundId: activeRound?.id,
      }),
    [process, activeRound]
  );

  const eligibleCandidates = useMemo(
    () =>
      getEligibleCandidates({
        candidates,
        roundId: activeRound?.id,
      }),
    [candidates, activeRound]
  );

  const stats = useMemo(
    () => getPipelineStats({ process, candidates }),
    [process, candidates]
  );

  const handleAdvanceRound = () => {
    if (!activeRound || !nextRound || eligibleCandidates.length === 0) return;

    advanceRound.mutate(
      {
        hiringProcessId,
        currentRoundId: activeRound.id,
        nextRoundId: nextRound.id,
        candidateIds: eligibleCandidates.map((c) => c.candidateId),
      },
      {
        onSuccess: () => {
          setIsMoveDialogOpen(false);
        },
      }
    );
  };

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

      {/* Next Round Action Banner */}
      <NextRoundAction
        currentRound={activeRound}
        nextRound={nextRound}
        candidateCount={eligibleCandidates.length}
        onMove={() => setIsMoveDialogOpen(true)}
        isMoving={advanceRound.isPending}
      />

      {advanceRound.isError && (
        <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-4">
          <p className="text-sm font-medium text-destructive">
            {advanceRound.error?.message ??
              "Unable to move candidates to the next round."}
          </p>
        </div>
      )}

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

      {/* Confirmation Dialog */}
      <AlertDialog
        open={isMoveDialogOpen}
        onOpenChange={setIsMoveDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Move candidates to {nextRound?.title}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {eligibleCandidates.length}{" "}
              {eligibleCandidates.length === 1
                ? "shortlisted candidate"
                : "shortlisted candidates"}{" "}
              will enter {nextRound?.title}. Their history in {activeRound?.title} will be preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={advanceRound.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                handleAdvanceRound();
              }}
              disabled={advanceRound.isPending}
            >
              {advanceRound.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Moving Candidates...
                </>
              ) : (
                `Move ${eligibleCandidates.length} Candidates`
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HiringProcessDetail;
