"use client";

import { Button } from "@/components/ui/button";
import {
  EmptyState,
  PageHeader,
  PageToolbar,
  SearchInput,
} from "@/components/common";

import {
  DifficultyFilter,
  GameGrid,
  StatusFilter,
} from "../components";
import { useGames } from "../hooks";

const GameList = () => {
  const {
    games,
    search,
    setSearch,
    difficulty,
    setDifficulty,
    status,
    setStatus,
  } = useGames();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Games"
        description="Manage game configurations used in assessments."
      >
        <Button>Create Configuration</Button>
      </PageHeader>

      <PageToolbar
        leftContent={
          <div className="flex gap-3">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search games..."
            />
            <DifficultyFilter
              value={difficulty}
              onChange={setDifficulty}
            />
            <StatusFilter
              value={status}
              onChange={setStatus}
            />
          </div>
        }
        rightContent={
          <Button variant="outline">
            Export
          </Button>
        }
      />

      {games.length === 0 ? (
        <EmptyState
          title="No games found"
          description="Try changing your search keyword or filters."
          actionLabel="Clear Search"
          onAction={() => {
            setSearch("");
            setDifficulty("all");
            setStatus("all");
          }}
        />
      ) : (
        <GameGrid games={games} />
      )}
    </div>
  );
};

export default GameList;
