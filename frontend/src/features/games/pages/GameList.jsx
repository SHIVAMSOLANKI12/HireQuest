"use client";

import { Button } from "@/components/ui/button";
import {
  PageHeader,
  PageToolbar,
  SearchInput,
} from "@/components/common";

import { GameGrid } from "../components";
import { useGames } from "../hooks";

const GameList = () => {
  const {
    search,
    setSearch,
    games,
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
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search games..."
          />
        }
        rightContent={
          <Button variant="outline">
            Export
          </Button>
        }
      />

      <GameGrid games={games} />
    </div>
  );
};

export default GameList;
