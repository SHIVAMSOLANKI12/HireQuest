import PatternMemoryGame from "../games/PatternMemoryGame";

const GameDispatcher = ({ section, onComplete }) => {
  // Default to pattern-memory if gameType is not specified
  const gameType = section.gameType ?? "pattern-memory";

  switch (gameType) {
    case "pattern-memory":
      return (
        <PatternMemoryGame
          config={section.config}
          onComplete={onComplete}
        />
      );

    default:
      return (
        <div className="rounded-xl border p-8 text-center">
          <h2 className="text-xl font-semibold">Game unavailable</h2>
          <p className="mt-2 text-muted-foreground">
            This game type ({gameType}) is not supported yet.
          </p>
        </div>
      );
  }
};

export default GameDispatcher;
