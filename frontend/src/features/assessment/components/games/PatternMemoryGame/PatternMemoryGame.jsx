"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const DEFAULT_PATTERN = [7, 2, 9];

const PatternMemoryGame = ({ onComplete }) => {
  const [phase, setPhase] = useState("memorize");
  const pattern = DEFAULT_PATTERN;

  const options = [
    [7, 2, 9],
    [2, 7, 9],
    [9, 2, 7],
  ];

  const handleAnswer = (selectedPattern) => {
    const isCorrect = selectedPattern.join("-") === pattern.join("-");

    onComplete?.({
      score: isCorrect ? 100 : 0,
      accuracy: isCorrect ? 100 : 0,
      roundsCompleted: 1,
    });
  };

  if (phase === "memorize") {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          Remember this pattern
        </p>

        <div className="mt-8 flex justify-center gap-4">
          {pattern.map((number, index) => (
            <div
              key={index}
              className="flex h-16 w-16 items-center justify-center rounded-xl border text-2xl font-semibold bg-muted/40 shadow-sm"
            >
              {number}
            </div>
          ))}
        </div>

        <Button className="mt-8" onClick={() => setPhase("answer")}>
          Hide Pattern
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-8">
      <div className="text-center">
        <p className="text-sm font-medium text-muted-foreground">
          Pattern Memory
        </p>
        <h2 className="mt-2 text-2xl font-semibold">Which pattern did you see?</h2>
      </div>

      <div className="mx-auto mt-8 grid max-w-md gap-3">
        {options.map((option, index) => (
          <Button
            key={index}
            type="button"
            variant="outline"
            className="h-auto py-4 text-lg tracking-widest font-mono"
            onClick={() => handleAnswer(option)}
          >
            {option.join("  ")}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PatternMemoryGame;
