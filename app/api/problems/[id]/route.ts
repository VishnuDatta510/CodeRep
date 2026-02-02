import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
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

    // Handle notes update
    if (updateNotes !== undefined) {
      const updatedProblem = await db.problem.update({
        where: { id: id },
        data: {
          notes: updateNotes,
        },
      });
      return NextResponse.json(updatedProblem);
    }

    // Handle tracking toggle
    if (toggleTracking !== undefined) {
      const updatedProblem = await db.problem.update({
        where: { id: id },
        data: {
          isTracking: toggleTracking,
        },
      });
      return NextResponse.json(updatedProblem);
    }

    // Handle progress reset (for mastered problems)
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

    // Handle review rating
    const MAX_INTERVAL = 60; // Safety cap: max 60 days between reviews
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

    // Apply safety cap to prevent intervals from getting too long
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
