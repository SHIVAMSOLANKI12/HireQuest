"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader, PageToolbar, SearchInput } from "@/components/common";

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
          <Button variant="outline">
            Export
          </Button>
        }
      />
    </div>
  );
};

export default GameList;
