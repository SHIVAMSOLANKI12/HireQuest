"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common";

import {
  AssessmentCard,
  AssessmentFilters,
} from "../components";
import { useAssessmentsQuery } from "../hooks";

const AssessmentList = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const {
    data: assessments = [],
    isLoading,
    isError,
    error,
  } = useAssessmentsQuery();

  const filteredAssessments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return assessments.filter((assessment) => {
      const title = assessment.title?.toLowerCase() ?? "";
      const description = assessment.description?.toLowerCase() ?? "";

      const matchesSearch =
        !query ||
        title.includes(query) ||
        description.includes(query);

      const matchesStatus =
        status === "all" || assessment.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [assessments, search, status]);

  const handleClearFilters = () => {
    setSearch("");
    setStatus("all");
  };

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

      <AssessmentFilters
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onClear={handleClearFilters}
      />

      {/* Result counter */}
      {!isLoading && !isError && assessments.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {filteredAssessments.length}
          </span>{" "}
          of {assessments.length} assessments
        </p>
      )}

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

      {/* Case A: Empty state — No assessments exist */}
      {!isLoading && !isError && assessments.length === 0 && (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <h2 className="text-lg font-semibold">
            No assessments yet
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Create your first assessment to get started.
          </p>
        </div>
      )}

      {/* Case B: Empty state — Assessments exist but filter returned 0 results */}
      {!isLoading &&
        !isError &&
        assessments.length > 0 &&
        filteredAssessments.length === 0 && (
          <div className="rounded-xl border border-dashed p-12 text-center">
            <h2 className="text-lg font-semibold">
              No matching assessments
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Try changing your search or status filter.
            </p>

            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </div>
        )}

      {/* Assessment Grid */}
      {!isLoading && !isError && filteredAssessments.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredAssessments.map((assessment) => (
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
