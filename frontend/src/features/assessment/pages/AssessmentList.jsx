"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common";

const AssessmentList = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Assessments"
        description="Create and manage hiring assessments for your candidates."
      >
        <Button asChild>
          <Link href="/assessments/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Assessment
          </Link>
        </Button>
      </PageHeader>

      <div className="rounded-xl border border-dashed p-12 text-center">
        <h2 className="text-lg font-semibold">
          No assessments yet
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Create your first assessment by selecting
          games and questions from your library.
        </p>
      </div>
    </div>
  );
};

export default AssessmentList;
