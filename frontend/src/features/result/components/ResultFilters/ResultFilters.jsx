"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ResultFilters = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
}) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search candidate by name or email..."
        className="sm:max-w-sm"
      />

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="sm:w-48">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="Completed">Completed</SelectItem>
          <SelectItem value="In Progress">In Progress</SelectItem>
          <SelectItem value="Invited">Invited</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ResultFilters;
