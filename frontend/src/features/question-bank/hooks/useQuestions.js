import { useEffect, useMemo, useState } from "react";
import { calculateTotalPages } from "@/lib/helpers";
import { questions as initialQuestions } from "../data";

const useQuestions = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Auto reset page when filters or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, difficulty, status, sortBy]);

  const { paginatedQuestions, totalPages, totalQuestions } = useMemo(() => {
    let data = [...initialQuestions];

    if (search) {
      data = data.filter((q) =>
        q.question.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "all") {
      data = data.filter((q) => q.category === category);
    }

    if (difficulty !== "all") {
      data = data.filter((q) => q.difficulty === difficulty);
    }

    if (status !== "all") {
      data = data.filter((q) => q.status === status);
    }

    switch (sortBy) {
      case "question-asc":
        data.sort((a, b) => a.question.localeCompare(b.question));
        break;

      case "question-desc":
        data.sort((a, b) => b.question.localeCompare(a.question));
        break;

      default:
        break;
    }

    const total = data.length;
    const totalPagesCount = calculateTotalPages(total, pageSize);
    const sliced = data.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );

    return {
      paginatedQuestions: sliced,
      totalPages: totalPagesCount,
      totalQuestions: total,
    };
  }, [search, category, difficulty, status, sortBy, currentPage]);

  return {
    questions: paginatedQuestions,
    totalQuestions,
    search,
    setSearch,
    category,
    setCategory,
    difficulty,
    setDifficulty,
    status,
    setStatus,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    totalPages,
  };
};

export default useQuestions;
