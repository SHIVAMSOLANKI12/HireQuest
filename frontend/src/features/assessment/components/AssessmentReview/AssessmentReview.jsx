"use client";

import {
  Check,
  Clock,
  Gamepad2,
  HelpCircle,
  RotateCcw,
  Target,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AssessmentReview = ({
  assessment,
  games = [],
  questions = [],
  onBack,
  onSaveDraft,
  onPublish,
  isSubmitting = false,
  submitAction = null,
  error = null,
  validationErrors = {},
}) => {
  const selectedGames = games.filter((game) =>
    assessment.selectedGameIds.includes(game.id)
  );

  const selectedQuestions = questions.filter((question) =>
    assessment.selectedQuestionIds.includes(question.id)
  );

  const hasValidationErrors = Object.keys(validationErrors).length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">
          Review Assessment
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Review the assessment before saving or publishing it.
        </p>
      </div>

      {/* Validation Error Summary */}
      {hasValidationErrors && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
          <p className="font-medium text-destructive">
            Assessment cannot be published.
          </p>

          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-destructive">
            {Object.values(validationErrors).map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Basic Details */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle>
                {assessment.title}
              </CardTitle>

              {assessment.description && (
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  {assessment.description}
                </p>
              )}
            </div>

            <Badge variant="secondary">
              Draft
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Overview */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <Clock className="h-5 w-5 text-muted-foreground" />

            <div>
              <p className="text-sm text-muted-foreground">
                Duration
              </p>

              <p className="font-semibold">
                {assessment.duration} min
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <Target className="h-5 w-5 text-muted-foreground" />

            <div>
              <p className="text-sm text-muted-foreground">
                Passing Score
              </p>

              <p className="font-semibold">
                {assessment.passingScore}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <RotateCcw className="h-5 w-5 text-muted-foreground" />

            <div>
              <p className="text-sm text-muted-foreground">
                Attempts
              </p>

              <p className="font-semibold">
                {assessment.attemptsAllowed}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <HelpCircle className="h-5 w-5 text-muted-foreground" />

            <div>
              <p className="text-sm text-muted-foreground">
                Questions
              </p>

              <p className="font-semibold">
                {selectedQuestions.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Games */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Gamepad2 className="h-5 w-5" />
            Games ({selectedGames.length})
          </CardTitle>
        </CardHeader>

        <CardContent>
          {selectedGames.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {selectedGames.map((game) => (
                <div
                  key={game.id}
                  className="rounded-lg border p-4"
                >
                  <p className="font-medium">
                    {game.title ?? game.name}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {game.category && (
                      <Badge variant="secondary">
                        {game.category}
                      </Badge>
                    )}

                    {game.difficulty && (
                      <Badge variant="outline">
                        {game.difficulty}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No games selected.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Selected Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Questions ({selectedQuestions.length})
          </CardTitle>
        </CardHeader>

        <CardContent>
          {selectedQuestions.length > 0 ? (
            <div className="space-y-3">
              {selectedQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className="flex gap-3 rounded-lg border p-4"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      {question.question}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        {question.category}
                      </Badge>

                      <Badge variant="outline">
                        {question.difficulty}
                      </Badge>

                      <Badge variant="outline">
                        {question.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No questions selected.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Candidate Settings
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <SettingRow
            label="Shuffle Questions"
            enabled={assessment.shuffleQuestions}
          />

          <SettingRow
            label="Show Result to Candidate"
            enabled={assessment.showResultToCandidate}
          />
        </CardContent>
      </Card>

      {/* API Error display */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">
            {error.message || "Unable to save assessment."}
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </Button>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onSaveDraft}
            disabled={isSubmitting}
          >
            {isSubmitting && submitAction === "draft"
              ? "Saving..."
              : "Save Draft"}
          </Button>

          <Button
            type="button"
            onClick={onPublish}
            disabled={isSubmitting}
          >
            {isSubmitting && submitAction === "publish"
              ? "Publishing..."
              : "Publish Assessment"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const SettingRow = ({ label, enabled }) => {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <span className="text-sm font-medium">
        {label}
      </span>

      <div
        className={
          enabled
            ? "flex items-center gap-2 text-sm font-medium text-primary"
            : "flex items-center gap-2 text-sm text-muted-foreground"
        }
      >
        {enabled ? (
          <>
            <Check className="h-4 w-4" />
            Enabled
          </>
        ) : (
          <>
            <X className="h-4 w-4" />
            Disabled
          </>
        )}
      </div>
    </div>
  );
};

export default AssessmentReview;
