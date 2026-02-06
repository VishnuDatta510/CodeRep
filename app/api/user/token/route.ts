import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

export async function POST(_req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90);

    await db.apiToken.deleteMany({
      where: { userId },
    });

    await db.apiToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });

    return NextResponse.json({ token, expiresAt });
  } catch (error) {
    console.error("Error generating token:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(_req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiToken = await db.apiToken.findFirst({
      where: { userId },
      select: {
        token: true,
        expiresAt: true,
        createdAt: true,
      },
    });

    if (!apiToken) {
      return NextResponse.json({ token: null });
    }

    if (apiToken.expiresAt < new Date()) {
      return NextResponse.json({ token: null, expired: true });
    }

    return NextResponse.json(apiToken);
  } catch (error) {
    console.error("Error fetching token:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.apiToken.deleteMany({
      where: { userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting token:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
