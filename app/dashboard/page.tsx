import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ProblemList } from "@/components/problems/problem-list";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const problems = await db.problem.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const trackedProblems = problems.filter((p) => p.isTracking);
  const untrackedProblems = problems.filter((p) => !p.isTracking);

  return (
    <ProblemList
      initialProblems={problems}
      trackedCount={trackedProblems.length}
      untrackedCount={untrackedProblems.length}
    />
  );
}
