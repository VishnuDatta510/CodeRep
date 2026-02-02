import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-4">
      <h1 className="text-4xl font-bold">CodeRep</h1>
      <p className="text-xl">Welcome to your Spaced Repetition App</p>

      <Link href="/dashboard">
        <Button size="lg">Go to Dashboard</Button>
      </Link>
    </main>
  );
}
