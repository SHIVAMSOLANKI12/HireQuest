import { Gamepad2, HelpCircle } from "lucide-react";

/**
 * Placeholder section renderer.
 * In Sprint 8.11+, this will dispatch to QuizRenderer or GameRenderer
 * based on section.type.
 */
const AssessmentSection = ({ section }) => {
  if (!section) return null;

  const isQuiz = section.type === "quiz";
  const Icon = isQuiz ? HelpCircle : Gamepad2;
  const typeLabel = isQuiz ? "Quiz" : "Game";

  return (
    <div className="rounded-xl border bg-card p-6 sm:p-10">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 rounded-lg border bg-muted p-3">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {typeLabel}
          </p>
          <h2 className="mt-1 text-2xl font-semibold leading-snug">
            {section.title}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {isQuiz
              ? "Quiz questions will be rendered here in the next sprint."
              : "Game content will be rendered here in the next sprint."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssessmentSection;
