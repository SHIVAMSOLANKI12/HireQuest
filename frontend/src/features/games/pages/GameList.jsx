"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PageHeader,
  PageToolbar,
  SearchInput,
} from "@/components/common";

import { GameGrid } from "../components";
import { games } from "../data";

const GameList = () => {
  const [search, setSearch] = useState("");

  const filteredGames = games.filter((game) =>
    game.title.toLowerCase().includes(search.toLowerCase()) ||
    game.category.toLowerCase().includes(search.toLowerCase())
  );

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

      <GameGrid games={filteredGames} />
    </div>
  );
};

export default GameList;
