"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { games } from "@/features/games/data";
import { useQuestionsQuery } from "@/features/question-bank/hooks";
import { QUESTION_STATUS } from "@/features/question-bank/constants";

import { useAssessmentBuilder } from "../../hooks";

import AssessmentStepper from "../AssessmentStepper";
import AssessmentStepContent from "../AssessmentStepContent";
import AssessmentDetailsForm from "../AssessmentDetailsForm";
import GameSelectionStep from "../GameSelectionStep";
import QuestionSelectionStep from "../QuestionSelectionStep";

// Static games data — swap with useGamesQuery() when real API is connected
const isGamesLoading = false;
const isGamesError = false;

const AssessmentBuilder = () => {
  const {
    currentStep,
    assessment,
    updateAssessment,
    previousStep,
    nextStep,
    isFirstStep,
    isLastStep,
  } = useAssessmentBuilder();

  // Questions from existing Question Bank — same source of truth
  const {
    data: questions = [],
    isLoading: isQuestionsLoading,
    isError: isQuestionsError,
  } = useQuestionsQuery();

  // Only Active questions are selectable in assessments
  const availableQuestions = questions.filter(
    (question) =>
      question.status === QUESTION_STATUS.ACTIVE
  );

  const handleDetailsContinue = (data) => {
    updateAssessment(data);
    nextStep();
  };

  const handleGamesContinue = (selectedGameIds) => {
    updateAssessment({ selectedGameIds });
    nextStep();
  };

  const handleQuestionsContinue = (selectedQuestionIds) => {
    updateAssessment({ selectedQuestionIds });
    nextStep();
  };

  return (
    <div className="space-y-8">
      <AssessmentStepper currentStep={currentStep} />

      {/* ── Step 1: Details ── */}
      {currentStep === 1 && (
        <AssessmentDetailsForm
          defaultValues={assessment}
          onContinue={handleDetailsContinue}
        />
      )}

      {/* ── Step 2: Game Selection ── */}
      {currentStep === 2 && isGamesLoading && (
        <div className="rounded-xl border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Loading games...
          </p>
        </div>
      )}

      {currentStep === 2 && isGamesError && (
        <div className="rounded-xl border border-destructive/50 p-8 text-center">
          <h3 className="font-semibold">Unable to load games</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Games could not be loaded. Please try again.
          </p>
        </div>
      )}

      {currentStep === 2 &&
        !isGamesLoading &&
        !isGamesError && (
          <GameSelectionStep
            games={games}
            selectedGameIds={assessment.selectedGameIds}
            onSelectionChange={(ids) =>
              updateAssessment({ selectedGameIds: ids })
            }
            onBack={previousStep}
            onContinue={handleGamesContinue}
          />
        )}

      {/* ── Step 3: Question Selection ── */}
      {currentStep === 3 && isQuestionsLoading && (
        <div className="rounded-xl border p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Loading questions...
          </p>
        </div>
      )}

      {currentStep === 3 && isQuestionsError && (
        <div className="rounded-xl border border-destructive/50 p-10 text-center">
          <h3 className="font-semibold">Unable to load questions</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Questions could not be loaded. Please try again.
          </p>
        </div>
      )}

      {currentStep === 3 &&
        !isQuestionsLoading &&
        !isQuestionsError && (
          <QuestionSelectionStep
            questions={availableQuestions}
            selectedQuestionIds={assessment.selectedQuestionIds}
            onSelectionChange={(ids) =>
              updateAssessment({ selectedQuestionIds: ids })
            }
            onBack={previousStep}
            onContinue={handleQuestionsContinue}
          />
        )}

      {/* ── Step 4+: Placeholder ── */}
      {currentStep >= 4 && (
        <AssessmentStepContent currentStep={currentStep} />
      )}

      {/* ── Global footer: only for step 4+ ── */}
      {/* Step 1 → DetailsForm owns Continue              */}
      {/* Step 2 → GameSelectionStep owns Back/Continue   */}
      {/* Step 3 → QuestionSelectionStep owns Back/Continue */}
      {currentStep >= 4 && (
        <div className="flex items-center justify-between border-t pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={previousStep}
            disabled={isFirstStep}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {!isLastStep ? (
            <Button type="button" onClick={nextStep}>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="button" disabled>
              Publish Assessment
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AssessmentBuilder;
