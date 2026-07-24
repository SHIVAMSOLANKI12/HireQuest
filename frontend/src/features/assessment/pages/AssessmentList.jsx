"use client";

import {
  AssessmentHeader,
  AssessmentToolbar,
  AssessmentGrid,
  EmptyState,
  ErrorState,
  AssessmentGridSkeleton,
} from "../components";

import { useAssessments } from "../hooks";

const AssessmentList = () => {
  const {
    assessments,
    loading,
    error,
    refetch,
  } = useAssessments();

  return (
    <div className="space-y-6">
      <AssessmentHeader />

      <AssessmentToolbar />

      {loading ? (
        <AssessmentGridSkeleton />
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : assessments.length === 0 ? (
        <EmptyState />
      ) : (
        <AssessmentGrid assessments={assessments} />
      )}
    </div>
  );
};

export default AssessmentList;
