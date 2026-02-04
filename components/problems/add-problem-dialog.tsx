"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

export function AddProblemDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const lastFetchedUrl = useRef("");

  const [formData, setFormData] = useState({
    title: "",
    url: "",
    difficulty: "",
    notes: "",
  });

  // Fetch problem details from LeetCode URL
  const fetchDetails = async (url: string) => {
    // Prevent duplicate fetches for the same URL
    if (!url || lastFetchedUrl.current === url) return;

    // Check if it's a valid LeetCode URL
    if (!url.includes("leetcode.com/problems/")) return;

    lastFetchedUrl.current = url;
    setFetching(true);
    setFetchError("");

    // Clear previous problem details when fetching new one
    setFormData((prev) => ({
      ...prev,
      title: "",
      difficulty: "",
    }));

    try {
      const res = await fetch("/api/problems/parse-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (res.ok) {
        setFormData((prev) => ({
          ...prev,
          title: data.title,
          difficulty: data.difficulty,
        }));
        setFetchError("");
      } else {
        // Show error and don't populate form
        setFetchError(data.error || "Failed to fetch problem details");
        lastFetchedUrl.current = ""; // Allow retry
      }
    } catch (error) {
      console.error(error);
      setFetchError("Network error. Please try again.");
      lastFetchedUrl.current = ""; // Allow retry
    } finally {
      setFetching(false);
    }
  };

  // Handle paste event - instant detection
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    if (pastedText.includes("leetcode.com/problems/")) {
      setFormData((prev) => ({ ...prev, url: pastedText }));
      fetchDetails(pastedText);
      e.preventDefault(); // Prevent default paste since we're handling it
    }
  };

  // Handle regular typing
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData({ ...formData, url });
    setFetchError("");

    // Clear title/difficulty when URL is manually changed
    if (formData.title) {
      setFormData((prev) => ({
        ...prev,
        url,
        title: "",
        difficulty: "",
      }));
      lastFetchedUrl.current = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.difficulty) {
      setFetchError(
        "Please fetch problem details first or fill in title and difficulty",
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setOpen(false);
        setFormData({ title: "", url: "", difficulty: "", notes: "" });
        setFetchError("");
        router.refresh();
      } else {
        setFetchError("Failed to save problem. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setFetchError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-500";
      case "Medium":
        return "text-yellow-500";
      case "Hard":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Add New Problem</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Problem</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* URL Input - Primary Field */}
          <div className="grid gap-2">
            <Label htmlFor="url">LeetCode URL</Label>
            <Input
              id="url"
              placeholder="Paste LeetCode URL here..."
              value={formData.url}
              onChange={handleUrlChange}
              onPaste={handlePaste}
              required
            />
            {fetching && (
              <p className="text-sm text-blue-600 font-medium">
                Fetching problem details...
              </p>
            )}
            {fetchError && (
              <p className="text-sm text-red-600 font-semibold">{fetchError}</p>
            )}
          </div>

          {/* Auto-filled Problem Details */}
          {formData.title && (
            <div className="rounded-lg border bg-muted/50 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{formData.title}</span>
                <span
                  className={`text-sm font-semibold ${getDifficultyColor(formData.difficulty)}`}
                >
                  {formData.difficulty}
                </span>
              </div>
            </div>
          )}

          {/* Notes - Only user input needed */}
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes / Pattern / Hint (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="e.g., Use a hashmap to store indices..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !formData.title}
            className="w-full"
          >
            {loading ? "Saving..." : "Save Problem"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
