import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

/** Gets userId from Clerk session or API token */
async function getUserId(req: Request): Promise<string | null> {
  // Check Bearer token FIRST for faster extension authentication
  const authHeader = req.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const apiToken = await db.apiToken.findUnique({
      where: { token },
    });

    if (apiToken && apiToken.expiresAt > new Date()) {
      return apiToken.userId;
    }
  }

  // Fall back to Clerk session auth for web requests
  const { userId } = await auth();
  if (userId) return userId;

  return null;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getUserId(req);
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const body = await req.json();
    const { rating, toggleTracking, resetProgress, updateNotes } = body;

    const problem = await db.problem.findUnique({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    if (updateNotes !== undefined) {
      const updatedProblem = await db.problem.update({
        where: { id: id },
        data: {
          notes: updateNotes,
        },
      });
      return NextResponse.json(updatedProblem);
    }

    if (toggleTracking !== undefined) {
      const updatedProblem = await db.problem.update({
        where: { id: id },
        data: {
          isTracking: toggleTracking,
        },
      });
      return NextResponse.json(updatedProblem);
    }

    if (resetProgress) {
      const updatedProblem = await db.problem.update({
        where: { id: id },
        data: {
          interval: 1,
          step: 0,
          nextReviewDate: new Date(),
        },
      });
      return NextResponse.json(updatedProblem);
    }

    const MAX_INTERVAL = 60;
    let newInterval = problem.interval;

    if (rating === "Reset") {
      newInterval = 1;
    } else if (rating === "Hard") {
      newInterval = Math.ceil(problem.interval * 1.2);
    } else if (rating === "Good") {
      newInterval = Math.ceil(problem.interval * 2.5);
    } else if (rating === "Easy") {
      newInterval = Math.ceil(problem.interval * 4.0);
    }

    newInterval = Math.min(newInterval, MAX_INTERVAL);

    const newDate = new Date();
    newDate.setDate(newDate.getDate() + newInterval);

    const updatedProblem = await db.problem.update({
      where: { id: id },
      data: {
        interval: newInterval,
        nextReviewDate: newDate,
        step: problem.step + 1,
      },
    });

    return NextResponse.json(updatedProblem);
  } catch (error) {
    console.error("Error updating problem:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/** Deletes a problem permanently */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getUserId(req);
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const problem = await db.problem.findUnique({
      where: { id, userId },
    });

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    await db.problem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting problem:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
