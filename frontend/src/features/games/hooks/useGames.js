"use client";

import { useMemo, useState } from "react";

import { games as initialGames } from "../data";

const useGames = () => {
  const [search, setSearch] = useState("");

  const filteredGames = useMemo(() => {
    if (!search.trim()) return initialGames;

    return initialGames.filter((game) =>
      game.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return {
    search,
    setSearch,
    games: filteredGames,
  };
};

export default useGames;
