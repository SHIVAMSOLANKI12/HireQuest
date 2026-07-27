import { ASSESSMENT_STEPS } from "../../constants";

const AssessmentStepContent = ({
  currentStep,
}) => {
  const step = ASSESSMENT_STEPS.find(
    (item) => item.id === currentStep
  );

  return (
    <div className="rounded-xl border p-8">
      <h2 className="text-xl font-semibold">
        {step?.label}
      </h2>

      <p className="mt-2 text-sm text-muted-foreground">
        Step {currentStep} content will be added here.
      </p>
    </div>
  );
};

export default AssessmentStepContent;
