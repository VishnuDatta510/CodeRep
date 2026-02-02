"use client";

import { useState } from "react";
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

  return (
    <div className="p-4 border rounded-lg flex justify-between items-center bg-card shadow-sm transition-all hover:shadow-md">
      <div>
        <a
          href={problem.url}
          target="_blank"
          className="text-lg font-semibold hover:underline text-blue-600"
        >
          {problem.title}
        </a>
        <div className="flex gap-2 text-sm text-gray-500 mt-1">
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${
              problem.difficulty === "Easy"
                ? "bg-green-100 text-green-700"
                : problem.difficulty === "Medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
            }`}
          >
            {problem.difficulty}
          </span>
          {problem.interval >= 60 && (
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
              MASTERED
            </span>
          )}
          <span>• Interval: {problem.interval} days</span>
          {problem.interval >= 60 && (
            <button
              onClick={handleResetProgress}
              disabled={loading}
              className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-colors disabled:opacity-50"
            >
              🔄 Reset Progress
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="text-right">
          <p className="text-xs font-bold text-gray-400 uppercase">
            Next Review
          </p>
          <p className="text-sm font-medium">
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
                className="text-yellow-600 border-yellow-200"
                onClick={() => handleReview("Hard")}
                disabled={loading}
              >
                Hard
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-green-600 border-green-200"
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
                <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>Problem Notes</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Textarea
                      placeholder="Add hints, patterns, or reminders..."
                      value={notesText}
                      onChange={(e) => setNotesText(e.target.value)}
                      rows={12}
                      className="resize-none min-h-[400px]"
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
                    : "bg-green-50 text-green-700 hover:bg-green-100"
                }
              >
                {trackLoading
                  ? "..."
                  : problem.isTracking
                    ? "Stop Tracking"
                    : "Track Again"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
