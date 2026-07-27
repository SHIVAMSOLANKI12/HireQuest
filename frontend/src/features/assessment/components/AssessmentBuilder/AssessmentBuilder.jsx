"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { games } from "@/features/games/data";

import { useAssessmentBuilder } from "../../hooks";

import AssessmentStepper from "../AssessmentStepper";
import AssessmentStepContent from "../AssessmentStepContent";
import AssessmentDetailsForm from "../AssessmentDetailsForm";
import GameSelectionStep from "../GameSelectionStep";

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

  const handleDetailsContinue = (data) => {
    updateAssessment(data);
    nextStep();
  };

  const handleGamesContinue = (selectedGameIds) => {
    updateAssessment({ selectedGameIds });
    nextStep();
  };

  return (
    <div className="space-y-8">
      <AssessmentStepper
        currentStep={currentStep}
      />

      {currentStep === 1 && (
        <AssessmentDetailsForm
          defaultValues={assessment}
          onContinue={handleDetailsContinue}
        />
      )}

      {currentStep === 2 && (
        <GameSelectionStep
          games={games}
          selectedGameIds={assessment.selectedGameIds}
          onBack={previousStep}
          onContinue={handleGamesContinue}
        />
      )}

      {currentStep >= 3 && (
        <AssessmentStepContent
          currentStep={currentStep}
        />
      )}

      {currentStep >= 3 && (
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
            <Button
              type="button"
              onClick={nextStep}
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              disabled
            >
              Publish Assessment
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AssessmentBuilder;
