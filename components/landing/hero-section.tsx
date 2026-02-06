import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />

      <div className="relative mx-auto max-w-7xl px-8 py-32 md:py-40 lg:py-48">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border bg-muted px-5 py-2 text-base text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            Open source &amp; free forever
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            Never Forget a{" "}
            <span className="relative">
              <span className="relative z-10">LeetCode</span>
              <span className="absolute bottom-2 left-0 z-0 h-4 w-full bg-primary/10 md:bottom-4 md:h-5" />
            </span>{" "}
            Problem Again
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-8 max-w-2xl text-xl text-muted-foreground md:text-2xl">
            CodeRep uses spaced repetition to schedule your LeetCode reviews at
            the perfect time. Solve smarter, retain longer, and ace your
            interviews.
          </p>

          {/* CTAs */}
          <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 px-10 py-6 text-lg">
                Get Started
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button
                variant="outline"
                size="lg"
                className="px-10 py-6 text-lg"
              >
                See How It Works
              </Button>
            </a>
          </div>

          {/* Social proof */}
          <p className="mt-16 text-base text-muted-foreground">
            Built for developers who want to{" "}
            <span className="font-medium text-foreground">
              actually remember
            </span>{" "}
            what they practice.
          </p>
        </div>
      </div>
    </section>
  );
}
