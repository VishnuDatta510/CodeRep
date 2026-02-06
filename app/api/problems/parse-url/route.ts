import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

const GET_PROBLEM_QUERY = `
  query getProblem($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      title
      difficulty
      topicTags {
        name
      }
    }
  }
`;

/** Extracts the problem slug from a LeetCode URL */
function extractSlug(url: string): string | null {
  try {
    // Handles:
    // - https://leetcode.com/problems/two-sum/
    // - https://leetcode.com/problems/two-sum/description/
    // - https://leetcode.com/problems/two-sum/solutions/
    const patterns = [/leetcode\.com\/problems\/([a-z0-9-]+)/i];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const slug = extractSlug(url);

    if (!slug) {
      return NextResponse.json(
        {
          error:
            "Invalid LeetCode URL. Please use a URL like: https://leetcode.com/problems/two-sum/",
        },
        { status: 400 },
      );
    }

    const existingProblem = await db.problem.findFirst({
      where: {
        userId,
        url,
      },
    });

    if (existingProblem) {
      return NextResponse.json(
        { error: "You've already added this problem!" },
        { status: 409 },
      );
    }

    const response = await fetch(LEETCODE_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
      },
      body: JSON.stringify({
        query: GET_PROBLEM_QUERY,
        variables: { titleSlug: slug },
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from LeetCode" },
        { status: 502 },
      );
    }

    const data = await response.json();

    if (!data.data?.question) {
      return NextResponse.json(
        { error: "Problem not found on LeetCode" },
        { status: 404 },
      );
    }

    const { title, difficulty, topicTags } = data.data.question;

    return NextResponse.json({
      title,
      difficulty,
      tags: topicTags?.map((tag: { name: string }) => tag.name) || [],
    });
  } catch (error) {
    console.error("Error parsing LeetCode URL:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
