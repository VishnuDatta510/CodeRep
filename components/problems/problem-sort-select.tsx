"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SortOption =
  | "nextReview"
  | "difficulty"
  | "recentlyAdded"
  | "alphabetical";

interface ProblemSortSelectProps {
  value: SortOption;
  onValueChange: (value: SortOption) => void;
}

export function ProblemSortSelect({
  value,
  onValueChange,
}: ProblemSortSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="nextReview">Next Review</SelectItem>
        <SelectItem value="difficulty">Difficulty</SelectItem>
        <SelectItem value="recentlyAdded">Recently Added</SelectItem>
        <SelectItem value="alphabetical">Alphabetical</SelectItem>
      </SelectContent>
    </Select>
  );
}
