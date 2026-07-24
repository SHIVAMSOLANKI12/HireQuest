"use client";

import { useMemo, useState } from "react";
import { games as initialGames } from "../data";

const useGames = () => {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");

  const filteredAndSortedGames = useMemo(() => {
    // 1. Filter
    const filtered = initialGames.filter((game) => {
      const matchesSearch = game.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesDifficulty =
        difficulty === "all" || game.difficulty === difficulty;

      const matchesStatus =
        status === "all" || game.status === status;

      return matchesSearch && matchesDifficulty && matchesStatus;
    });

    // 2. Sort
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        case "duration-asc":
          return a.duration - b.duration;
        case "duration-desc":
          return b.duration - a.duration;
        case "used-desc":
          return b.usedIn - a.usedIn;
        default:
          return 0;
      }
    });
  }, [search, difficulty, status, sortBy]);

  return {
    games: filteredAndSortedGames,
    search,
    setSearch,
    difficulty,
    setDifficulty,
    status,
    setStatus,
    sortBy,
    setSortBy,
  };
};

export default useGames;
