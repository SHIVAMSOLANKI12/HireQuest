"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common";

import { AssessmentCard } from "../components";
import { useAssessmentsQuery } from "../hooks";

const AssessmentList = () => {
  const {
    data: assessments = [],
    isLoading,
    isError,
    error,
  } = useAssessmentsQuery();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assessments"
        description="Create and manage hiring assessments for your candidates."
      >
        <Link href="/assessments/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Assessment
          </Button>
        </Link>
      </PageHeader>

      {/* Loading state */}
      {isLoading && (
        <div className="rounded-xl border p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Loading assessments...
          </p>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="rounded-xl border border-destructive/50 p-10 text-center">
          <h2 className="font-semibold">
            Unable to load assessments
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {error?.message || "Something went wrong."}
          </p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && assessments.length === 0 && (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <h2 className="text-lg font-semibold">
            No assessments yet
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Create your first assessment by selecting games and questions from your library.
          </p>
        </div>
      )}

      {/* Assessment grid */}
      {!isLoading && !isError && assessments.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {assessments.map((assessment) => (
            <AssessmentCard
              key={assessment.id}
              assessment={assessment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AssessmentList;
