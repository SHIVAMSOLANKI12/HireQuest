"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Send,
  TriangleAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { getAssessmentReview } from "../../utils";
import ReviewSectionItem from "./ReviewSectionItem";

const AssessmentReview = ({
  assessment,
  attempt,
  onBack,
  onReviewSection,
  onSubmit,
}) => {
  const review = getAssessmentReview({
    assessment,
    attempt,
  });

  const progress =
    review.totalSections > 0
      ? (review.completedSections / review.totalSections) * 100
      : 0;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-20 border-b bg-background shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Assessment Review
          </p>
          <h1 className="mt-0.5 truncate text-xl font-semibold text-slate-900">
            {assessment.title}
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Review Your Assessment
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Check your progress before submitting the assessment.
          </p>
        </div>

        {/* Completion Progress Card */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="font-medium text-slate-900">Completion</p>
            <p className="text-sm font-semibold tabular-nums text-muted-foreground">
              {review.completedSections} / {review.totalSections} sections
            </p>
          </div>
          <Progress value={progress} className="mt-3 h-2.5" />
        </div>

        {/* Section Review List */}
        <div className="rounded-xl border bg-card px-6 shadow-sm">
          {review.sections.map((item) => (
            <ReviewSectionItem
              key={item.section.id}
              item={item}
              onReview={onReviewSection}
            />
          ))}
        </div>

        {/* Validation Status Banner */}
        {review.isComplete ? (
          <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">Ready to submit</p>
              <p className="mt-0.5 text-sm text-green-700">
                All assessment sections are complete.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <TriangleAlert className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-900">Assessment incomplete</p>
              <p className="mt-0.5 text-sm text-amber-700">
                {review.incompleteSections}{" "}
                {review.incompleteSections === 1 ? "section is" : "sections are"}{" "}
                still incomplete.
              </p>
            </div>
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between pt-2">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Assessment
          </Button>

          <Button type="button" onClick={onSubmit} disabled={!review.isComplete}>
            <Send className="mr-2 h-4 w-4" />
            Submit Assessment
          </Button>
        </div>
      </main>
    </div>
  );
};

export default AssessmentReview;
