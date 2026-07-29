import { Gamepad2 } from "lucide-react";
import QuizRenderer from "../QuizRenderer";

const AssessmentSection = ({ section, attempt, onSectionComplete }) => {
  if (!section) return null;

  if (section.type === "quiz") {
    return (
      <QuizRenderer
        section={section}
        attempt={attempt}
        onComplete={onSectionComplete}
      />
    );
  }

  if (section.type === "game") {
    return (
      <div className="rounded-xl border bg-card p-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 rounded-lg border bg-muted p-3">
            <Gamepad2 className="h-5 w-5 text-muted-foreground" />
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Game</p>
            <h2 className="mt-1 text-2xl font-semibold">{section.title}</h2>
            <p className="mt-3 text-muted-foreground">
              Game runtime will be implemented next.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border p-8 text-center text-muted-foreground">
      Unsupported assessment section.
    </div>
  );
};

export default AssessmentSection;
