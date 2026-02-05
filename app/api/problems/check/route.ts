import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

// Helper to get userId from Clerk session or API token
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

    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "URL parameter required" },
        { status: 400 },
      );
    }

    // Clean URL - remove query params and trailing slash
    const cleanUrl = url.split("?")[0].replace(/\/$/, "");

    const problem = await db.problem.findFirst({
      where: {
        userId,
        url: {
          contains: cleanUrl.split("/problems/")[1]?.split("/")[0] || cleanUrl,
        },
      },
    });

    return NextResponse.json({ exists: !!problem });
  } catch (error) {
    console.error("Error checking problem:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
