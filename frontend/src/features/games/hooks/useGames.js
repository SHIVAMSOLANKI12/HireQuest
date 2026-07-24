"use client";

import { useMemo, useState } from "react";
import { games as initialGames } from "../data";

const useGames = () => {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [status, setStatus] = useState("all");

  const filteredGames = useMemo(() => {
    return initialGames.filter((game) => {
      const matchesSearch = game.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesDifficulty =
        difficulty === "all" || game.difficulty === difficulty;

      const matchesStatus =
        status === "all" || game.status === status;

      return matchesSearch && matchesDifficulty && matchesStatus;
    });
  }, [search, difficulty, status]);

  return {
    games: filteredGames,
    search,
    setSearch,
    difficulty,
    setDifficulty,
    status,
    setStatus,
  };
};

export default useGames;
