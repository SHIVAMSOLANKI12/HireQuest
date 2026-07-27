"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { games } from "@/features/games/data";
import { useQuestionsQuery } from "@/features/question-bank/hooks";
import { QUESTION_STATUS } from "@/features/question-bank/constants";

import { ASSESSMENT_STATUS } from "../../constants";
import {
  useAssessmentBuilder,
  useCreateAssessment,
} from "../../hooks";
import { toAssessmentPayload } from "../../utils";

import AssessmentStepper from "../AssessmentStepper";
import AssessmentDetailsForm from "../AssessmentDetailsForm";
import GameSelectionStep from "../GameSelectionStep";
import QuestionSelectionStep from "../QuestionSelectionStep";
import AssessmentSettingsForm from "../AssessmentSettingsForm";
import AssessmentReview from "../AssessmentReview";

// Static games data — swap with useGamesQuery() when real API is connected
const isGamesLoading = false;
const isGamesError = false;

const AssessmentBuilder = () => {
  const router = useRouter();
  const [submitAction, setSubmitAction] = useState(null);

  const {
    currentStep,
    assessment,
    updateAssessment,
    previousStep,
    nextStep,
  } = useAssessmentBuilder();

  const createAssessment = useCreateAssessment();

  // Questions from existing Question Bank — same source of truth
  const {
    data: questions = [],
    isLoading: isQuestionsLoading,
    isError: isQuestionsError,
  } = useQuestionsQuery();

  // Only Active questions are selectable in assessments
  const availableQuestions = questions.filter(
    (question) => question.status === QUESTION_STATUS.ACTIVE
  );

  // ── Handlers ──────────────────────────────────────────────────

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

  const handleSettingsContinue = (data) => {
    updateAssessment(data);
    nextStep();
  };

  const handleSubmitAssessment = (status, action) => {
    const payload = toAssessmentPayload(assessment, status);
    setSubmitAction(action);

    createAssessment.mutate(payload, {
      onSuccess: () => {
        router.push("/assessments");
      },
      onSettled: () => {
        setSubmitAction(null);
      },
    });
  };

  const handleSaveDraft = () => {
    handleSubmitAssessment(ASSESSMENT_STATUS.DRAFT, "draft");
  };

  const handlePublish = () => {
    handleSubmitAssessment(ASSESSMENT_STATUS.PUBLISHED, "publish");
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

      {currentStep === 2 && !isGamesLoading && !isGamesError && (
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

      {currentStep === 3 && !isQuestionsLoading && !isQuestionsError && (
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

      {/* ── Step 4: Settings ── */}
      {currentStep === 4 && (
        <AssessmentSettingsForm
          defaultValues={assessment}
          onChange={(values) => updateAssessment(values)}
          onBack={previousStep}
          onContinue={handleSettingsContinue}
        />
      )}

      {/* ── Step 5: Review ── */}
      {currentStep === 5 && (
        <AssessmentReview
          assessment={assessment}
          games={games}
          questions={questions}
          onBack={previousStep}
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          isSubmitting={createAssessment.isPending}
          submitAction={submitAction}
          error={createAssessment.error}
        />
      )}
    </div>
  );
};

export default AssessmentBuilder;
