"use client";

import { Clock, FileText } from "lucide-react";

import { useAttemptQuery } from "../hooks";

const AssessmentAttempt = ({ attemptId }) => {
  const {
    data: attempt,
    isLoading,
    isError,
  } = useAttemptQuery(attemptId);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading assessment...</p>
      </div>
    );
  }

  if (isError || !attempt) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-2xl font-semibold">Assessment unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This assessment attempt could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-extrabold text-sm shadow">
              H
            </div>
            <span className="text-base font-semibold text-slate-900">
              HireQuest Assessment
            </span>
          </div>

          {/* Timer placeholder — Sprint 8.10 */}
          <div className="flex items-center gap-2 rounded-lg border bg-slate-50 px-4 py-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold tabular-nums text-slate-700">
              -- : --
            </span>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-4xl px-6 py-10 space-y-6">
        {/* Status */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Attempt Status
          </p>
          <p className="mt-1 text-2xl font-bold text-blue-900">
            {attempt.status}
          </p>
        </div>

        {/* Attempt info */}
        <div className="rounded-xl border bg-white p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Attempt Recorded</p>
              <p className="text-sm text-slate-500">
                Started at:{" "}
                {attempt.startedAt
                  ? new Date(attempt.startedAt).toLocaleString()
                  : "--"}
              </p>
            </div>
          </div>
        </div>

        {/* Placeholder — questions in Sprint 8.10 */}
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <FileText className="h-8 w-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">
            Assessment Ready
          </h2>
          <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
            Questions, timer and games will appear here in the next sprint.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Attempt ID: {attempt.id.slice(0, 8)}...
          </div>
        </div>
      </main>
    </div>
  );
};

export default AssessmentAttempt;
