"use client";

import { Button } from "@/components/ui/button";
import { PageHeader, PageToolbar, SearchInput } from "@/components/common";
import { QuestionGrid, QuestionStats } from "../components";
import { questions } from "../data";

const QuestionList = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Question Bank"
        description="Manage all MCQ questions used in assessments."
      >
        <Button>Add Question</Button>
      </PageHeader>

      <QuestionStats />

      <PageToolbar
        leftContent={
          <SearchInput
            value=""
            onChange={() => {}}
            placeholder="Search questions..."
          />
        }
        rightContent={
          <Button variant="outline">
            Export
          </Button>
        }
      />

      <QuestionGrid questions={questions} />
    </div>
  );
};

export default QuestionList;
