import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const CreateAssessmentHeader = () => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <Link
          href="/assessments"
          className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Assessments
        </Link>

        <h1 className="text-3xl font-bold tracking-tight">
          Create Assessment
        </h1>

        <p className="mt-1 text-muted-foreground">
          Configure a new hiring assessment for candidates.
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="outline">
          Save Draft
        </Button>

        <Button>
          Publish
        </Button>
      </div>
    </div>
  );
};

export default CreateAssessmentHeader;
