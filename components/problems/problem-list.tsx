"use client";

import { useState } from "react";
import { ProblemCard } from "./problem-card";
import { ProblemSortSelect, SortOption } from "./problem-sort-select";
import { AddProblemDialog } from "./add-problem-dialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import Link from "next/link";

interface Problem {
  id: string;
  title: string;
  url: string;
  difficulty: string;
  interval: number;
  notes: string | null;
  userId: string;
  createdAt: Date;
  nextReviewDate: Date;
  isTracking: boolean;
}

interface ProblemListProps {
  initialProblems: Problem[];
  trackedCount: number;
  untrackedCount: number;
}

export function ProblemList({
  initialProblems,
  trackedCount,
  untrackedCount,
}: ProblemListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("nextReview");

  const trackedProblems = initialProblems.filter((p) => p.isTracking);
  const untrackedProblems = initialProblems.filter((p) => !p.isTracking);

  const sortProblems = (problems: Problem[]) => {
    switch (sortBy) {
      case "nextReview":
        return [...problems].sort(
          (a, b) =>
            new Date(a.nextReviewDate).getTime() -
            new Date(b.nextReviewDate).getTime(),
        );
      case "difficulty":
        const difficultyOrder: Record<string, number> = {
          Easy: 1,
          Medium: 2,
          Hard: 3,
        };
        return [...problems].sort(
          (a, b) =>
            (difficultyOrder[a.difficulty] || 0) -
            (difficultyOrder[b.difficulty] || 0),
        );
      case "recentlyAdded":
        return [...problems].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      case "alphabetical":
        return [...problems].sort((a, b) =>
          a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
        );
      default:
        return problems;
    }
  };

  const sortedTrackedProblems = sortProblems(trackedProblems);

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Problems</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {trackedCount} tracked • {untrackedCount} archived
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ProblemSortSelect value={sortBy} onValueChange={setSortBy} />
          <AddProblemDialog />
          <Link href="/dashboard/settings">
            <Button variant="outline" size="icon" className="shrink-0">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4">
        {initialProblems.length === 0 ? (
          <div className="border border-dashed border-gray-300 p-20 rounded-lg text-center">
            <h2 className="text-xl font-semibold text-gray-600">
              No problems yet!
            </h2>
            <p className="text-gray-400">
              Add your first problem to start your spaced repetition.
            </p>
          </div>
        ) : (
          <>
            {/* Tracked Problems */}
            {sortedTrackedProblems.length > 0 && (
              <div className="space-y-4">
                {sortedTrackedProblems.map((problem) => (
                  <ProblemCard key={problem.id} problem={problem} />
                ))}
              </div>
            )}

            {/* Untracked/Archived Problems */}
            {untrackedProblems.length > 0 && (
              <details className="mt-8 group">
                <summary className="cursor-pointer p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors list-none">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-muted-foreground">
                      Archived Problems - {untrackedProblems.length}
                    </span>
                    <span className="text-xs text-muted-foreground group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </div>
                  <div className="mt-4 space-y-4 opacity-60 group-open:block hidden">
                    {untrackedProblems.map((problem) => (
                      <ProblemCard key={problem.id} problem={problem} />
                    ))}
                  </div>
                </summary>
              </details>
            )}
          </>
        )}
      </div>
    </div>
  );
}
