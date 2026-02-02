import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { AddProblemDialog } from "@/components/problems/add-problem-dialog";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ProblemCard } from "@/components/problems/problem-card";

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
    <div className="p-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Problems</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {trackedProblems.length} tracked • {untrackedProblems.length}{" "}
            archived
          </p>
        </div>
        <div className="flex items-center gap-4">
          <AddProblemDialog />
        </div>
      </div>

      <div className="grid gap-4">
        {problems.length === 0 ? (
          <div className="border border-dashed border-gray-300 p-20 rounded-lg text-center">
            <h2 className="text-xl font-semibold text-gray-600">
              No problems yet!
            </h2>
            <p className="text-gray-400">
              Add your first problem to start your spaced repetition.
            </p>
          </div>
        ) : (
          <>
            {/* Tracked Problems */}
            {trackedProblems.length > 0 && (
              <div className="space-y-4">
                {trackedProblems.map((problem) => (
                  <ProblemCard key={problem.id} problem={problem} />
                ))}
              </div>
            )}

            {/* Untracked/Archived Problems */}
            {untrackedProblems.length > 0 && (
              <details className="mt-8 group">
                <summary className="cursor-pointer p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-muted-foreground">
                      📦 Archived Problems ({untrackedProblems.length})
                    </span>
                    <span className="text-xs text-muted-foreground group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </div>
                </summary>
                <div className="mt-4 space-y-4 opacity-60">
                  {untrackedProblems.map((problem) => (
                    <ProblemCard key={problem.id} problem={problem} />
                  ))}
                </div>
              </details>
            )}
          </>
        )}
      </div>
    </div>
  );
}
