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

export async function POST(req: Request) {
  try {
    const userId = await getUserId(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, url, difficulty, notes } = body;

    const existingProblem = await db.problem.findFirst({
      where: {
        userId,
        url: {
          contains: url.split("?")[0],
        },
      },
    });

    if (existingProblem) {
      return NextResponse.json(existingProblem);
    }

    const newProblem = await db.problem.create({
      data: {
        userId,
        title,
        url: url.split("?")[0],
        difficulty,
        notes,
      },
    });

    return NextResponse.json(newProblem);
  } catch (error) {
    console.error("Error creating problem:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
