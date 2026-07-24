"use client";

import { useMemo, useState } from "react";
import { games as initialGames } from "../data";

const useGames = () => {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");

  const filteredGames = useMemo(() => {
    return initialGames.filter((game) => {
      const matchesSearch = game.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesDifficulty =
        difficulty === "all" || game.difficulty === difficulty;

      return matchesSearch && matchesDifficulty;
    });
  }, [search, difficulty]);

  return {
    games: filteredGames,
    search,
    setSearch,
    difficulty,
    setDifficulty,
  };
};

export default useGames;
