"use client";

import { Button } from "@/components/ui/button";
import { PageHeader, PageToolbar, SearchInput, Pagination, EmptyState } from "@/components/common";
import {
  CategoryFilter,
  DifficultyFilter,
  StatusFilter,
  SortFilter,
  QuestionGrid,
  QuestionStats,
} from "../components";
import { useQuestions } from "../hooks";

const QuestionList = () => {
  const {
    questions,
    totalQuestions,
    search,
    setSearch,
    category,
    setCategory,
    difficulty,
    setDifficulty,
    status,
    setStatus,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useQuestions();

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
          <div className="flex flex-wrap gap-3">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search questions..."
            />

            <CategoryFilter
              value={category}
              onChange={setCategory}
            />

            <DifficultyFilter
              value={difficulty}
              onChange={setDifficulty}
            />

            <StatusFilter
              value={status}
              onChange={setStatus}
            />

            <SortFilter
              value={sortBy}
              onChange={setSortBy}
            />
          </div>
        }
        rightContent={
          <Button variant="outline">
            Export
          </Button>
        }
      />

      {questions.length === 0 ? (
        <EmptyState
          title="No questions found"
          description="Try changing the filters or add a new question."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch("");
            setCategory("all");
            setDifficulty("all");
            setStatus("all");
            setSortBy("latest");
          }}
        />
      ) : (
        <>
          <QuestionGrid questions={questions} />

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {questions.length} of {totalQuestions} questions
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default QuestionList;
