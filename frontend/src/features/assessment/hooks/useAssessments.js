"use client";

import { useEffect, useState } from "react";
import { getAssessments } from "@/lib/api";

const useAssessments = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAssessments = async () => {
      try {
        const response = await getAssessments();
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssessments();
  }, []);

  return {
    data,
    isLoading,
    error,
  };
};

export default useAssessments;
