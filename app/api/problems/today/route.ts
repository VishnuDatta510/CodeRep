import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

/** Gets userId from Clerk session or API token */
async function getUserId(req: Request): Promise<string | null> {
  const { userId } = await auth();
  if (userId) return userId;

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

  return null;
}

export async function GET(req: Request) {
  try {
    const userId = await getUserId(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const problems = await db.problem.findMany({
      where: {
        userId,
        isTracking: true,
        nextReviewDate: {
          lt: tomorrow,
        },
      },
      orderBy: {
        nextReviewDate: "asc",
      },
      select: {
        id: true,
        title: true,
        url: true,
        difficulty: true,
        interval: true,
        nextReviewDate: true,
      },
    });

    return NextResponse.json(problems);
  } catch (error) {
    console.error("Error fetching today's problems:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
