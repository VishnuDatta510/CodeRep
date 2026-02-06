import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="border-b">
      <div className="mx-auto max-w-7xl px-8 py-32 md:py-40">
        <div className="relative overflow-hidden rounded-2xl border bg-primary px-10 py-20 text-center text-primary-foreground md:px-20">
          {/* Subtle pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[32px_32px]" />

          <div className="relative">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Ready to stop forgetting?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-xl text-primary-foreground/70">
              Join CodeRep and build a LeetCode practice habit that actually
              sticks. Free and open source.
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2 px-10 py-6 text-lg"
                >
                  Start Practicing
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
