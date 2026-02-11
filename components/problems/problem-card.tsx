"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { ExternalLink, Trash2 } from "lucide-react";

interface ProblemProps {
  problem: {
    id: string;
    title: string;
    url: string;
    difficulty: string;
    interval: number;
    nextReviewDate: Date;
    isTracking: boolean;
    notes: string | null;
  };
}

export function ProblemCard({ problem }: ProblemProps) {
  const router = useRouter();
  const [isReviewing, setIsReviewing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trackLoading, setTrackLoading] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesText, setNotesText] = useState(problem.notes || "");
  const [notesSaving, setNotesSaving] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [countdown, setCountdown] = useState("");

  const handleReview = async (rating: string) => {
    setLoading(true);
    try {
      await fetch(`/api/problems/${problem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });

      setIsReviewing(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTracking = async () => {
    setTrackLoading(true);
    try {
      await fetch(`/api/problems/${problem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toggleTracking: !problem.isTracking }),
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to update tracking status");
    } finally {
      setTrackLoading(false);
    }
  };

  const handleResetProgress = async () => {
    if (
      !confirm("Reset this problem's progress? It will start from day 1 again.")
    ) {
      return;
    }

    setLoading(true);
    try {
      await fetch(`/api/problems/${problem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetProgress: true }),
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to reset progress");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    setNotesSaving(true);
    try {
      await fetch(`/api/problems/${problem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updateNotes: notesText }),
      });
      setNotesOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to save notes");
    } finally {
      setNotesSaving(false);
    }
  };

  const handleDeleteNotes = async () => {
    if (!confirm("Delete these notes?")) return;

    setNotesSaving(true);
    try {
      await fetch(`/api/problems/${problem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updateNotes: null }),
      });
      setNotesText("");
      setNotesOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to delete notes");
    } finally {
      setNotesSaving(false);
    }
  };

  /** Permanently deletes the problem */
  const handleDelete = async () => {
    if (!confirm("Delete this problem permanently? This cannot be undone."))
      return;

    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/problems/${problem.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to delete problem");
    } finally {
      setDeleteLoading(false);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const reviewDate = new Date(problem.nextReviewDate);
  reviewDate.setHours(0, 0, 0, 0);
  const isDueToday = today.getTime() === reviewDate.getTime();
  const isOverdue = reviewDate.getTime() < today.getTime();

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const reviewDateFull = new Date(problem.nextReviewDate);
      const diffMs = reviewDateFull.getTime() - now.getTime();

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      if (days < 0) return "Overdue";
      if (days === 0) {
        if (hours > 0) return `Today (${hours}h ${minutes}m left)`;
        if (minutes > 0) return `Today (${minutes}m left)`;
        return "Due now";
      }
      if (days === 1) return `Tomorrow (${days}d ${hours}h left)`;
      return `${days} days (${days}d ${hours}h left)`;
    };

    setCountdown(calculateCountdown());
    const interval = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [problem.nextReviewDate]);

  return (
    <div
      className={`p-4 border rounded-lg flex justify-between items-center transition-all hover:shadow-md ${
        isOverdue
          ? "bg-red-50 border-red-300 dark:bg-black/30 dark:border-l-4 dark:border-l-red-500 dark:border-border shadow-sm"
          : isDueToday
            ? "bg-blue-50 border-blue-200 dark:bg-black/30 dark:border-l-4 dark:border-l-blue-500 dark:border-border shadow-sm"
            : "bg-card border-border shadow-sm"
      }`}
    >
      <div>
        <div className="flex items-center gap-2">
          <a
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
          >
            {problem.title}
            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          </a>
        </div>
        <div className="flex gap-2 text-sm text-muted-foreground mt-1">
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${
              problem.difficulty === "Easy"
                ? "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400"
                : problem.difficulty === "Medium"
                  ? "bg-yellow-100 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400"
                  : "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400"
            }`}
          >
            {problem.difficulty}
          </span>
          {problem.interval >= 60 && (
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
              MASTERED
            </span>
          )}
          {isOverdue && (
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 animate-pulse">
              Overdue
            </span>
          )}
          {isDueToday && (
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 animate-pulse">
              Due Today
            </span>
          )}
          <span>• {countdown}</span>
          {problem.interval >= 60 && (
            <button
              onClick={handleResetProgress}
              disabled={loading}
              className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-950/60 transition-colors disabled:opacity-50"
            >
              Reset Progress
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="text-right">
          <p className="text-xs font-bold text-muted-foreground uppercase">
            Next Review
          </p>
          <p className="text-sm font-medium text-foreground">
            {new Date(problem.nextReviewDate).toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="flex gap-2">
          {isReviewing ? (
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsReviewing(false)}
                disabled={loading}
                className="h-8 w-8 p-0"
              >
                ✕
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleReview("Reset")}
                disabled={loading}
              >
                Fail
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-50 dark:hover:bg-yellow-950/30"
                onClick={() => handleReview("Hard")}
                disabled={loading}
              >
                Hard
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-green-600 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-950/30"
                onClick={() => handleReview("Good")}
                disabled={loading}
              >
                Good
              </Button>
            </div>
          ) : (
            <>
              <Dialog open={notesOpen} onOpenChange={setNotesOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    Notes
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-200 max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>Problem Notes</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Textarea
                      placeholder="Add hints, patterns, or reminders..."
                      value={notesText}
                      onChange={(e) => setNotesText(e.target.value)}
                      rows={12}
                      className="resize-none min-h-100"
                    />
                    <div className="flex gap-2 justify-end">
                      {problem.notes && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleDeleteNotes}
                          disabled={notesSaving}
                        >
                          Delete
                        </Button>
                      )}
                      <Button
                        onClick={handleSaveNotes}
                        disabled={notesSaving}
                        size="sm"
                      >
                        {notesSaving ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button size="sm" onClick={() => setIsReviewing(true)}>
                Review Now
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleToggleTracking}
                disabled={trackLoading}
                className={
                  problem.isTracking
                    ? ""
                    : "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-950/60 border-green-200 dark:border-green-800"
                }
              >
                {trackLoading
                  ? "..."
                  : problem.isTracking
                    ? "Stop Tracking"
                    : "Track Again"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDelete}
                disabled={deleteLoading}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                title="Delete problem"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
