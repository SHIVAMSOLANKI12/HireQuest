"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PageHeader,
  PageToolbar,
  SearchInput,
  StatusBadge,
} from "@/components/common";

const GameList = () => {
  const [search, setSearch] = useState("");

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
          <div className="flex items-center gap-2">
            <StatusBadge status="Active" />

            <Button variant="outline">
              Export
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default GameList;
