import { Brain } from "lucide-react";

export function ScienceSection() {
  return (
    <section className="border-b bg-muted/30">
      <div className="mx-auto max-w-7xl px-8 py-32 md:py-40">
        <div className="flex flex-col items-center gap-20 lg:flex-row lg:gap-24">
          {/* Chart Placeholder */}
          <div className="flex-1">
            <div className="relative overflow-hidden rounded-xl border bg-background shadow-lg">
              <div className="p-8">
                {/* Forgetting Curve Visualization */}
                <p className="mb-6 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                  The Forgetting Curve
                </p>
                <div className="relative h-56">
                  {/* Y-axis label */}
                  <div className="absolute left-0 top-0 flex h-full flex-col justify-between text-xs text-muted-foreground">
                    <span>100%</span>
                    <span>75%</span>
                    <span>50%</span>
                    <span>25%</span>
                    <span>0%</span>
                  </div>
                  {/* Chart area */}
                  <div className="ml-10 h-full rounded-lg border border-dashed bg-muted/30 p-4">
                    <svg viewBox="0 0 400 180" className="h-full w-full">
                      {/* Without repetition - steep decay */}
                      <path
                        d="M0,10 C40,20 80,80 120,110 C160,135 240,155 400,165"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-destructive/60"
                        strokeDasharray="6 4"
                      />
                      {/* With spaced repetition - maintained high */}
                      <path
                        d="M0,10 C20,15 30,25 40,10 C50,15 60,30 80,10 C100,15 120,22 160,12 C200,15 240,18 400,15"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="text-primary"
                      />
                      {/* Review points */}
                      <circle cx="40" cy="10" r="4" className="fill-primary" />
                      <circle cx="80" cy="10" r="4" className="fill-primary" />
                      <circle cx="160" cy="12" r="4" className="fill-primary" />
                    </svg>
                  </div>
                </div>
                {/* Legend */}
                <div className="ml-10 mt-4 flex items-center gap-6 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-0.5 w-6 bg-primary" />
                    <span className="text-muted-foreground">With CodeRep</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-0.5 w-6 border-t-2 border-dashed border-destructive/60" />
                    <span className="text-muted-foreground">
                      Without review
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 space-y-7">
            <div className="inline-flex items-center gap-2.5 rounded-full border bg-muted px-4 py-1.5 text-base font-medium">
              <Brain className="size-5" />
              The Science
            </div>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Fight the Forgetting Curve
            </h2>

            <div className="space-y-5 text-lg text-muted-foreground leading-relaxed">
              <p>
                Research by Hermann Ebbinghaus showed that we forget up to{" "}
                <span className="font-medium text-foreground">
                  70% of new information within 24 hours
                </span>{" "}
                without reinforcement. This is the forgetting curve - and it
                applies to LeetCode problems too.
              </p>
              <p>
                Spaced repetition combats this by scheduling reviews at
                increasing intervals. Each time you successfully recall a
                solution, the memory gets stronger and the interval grows
                longer.
              </p>
              <p>
                CodeRep implements this scientifically-backed approach so you
                spend less time re-learning and more time{" "}
                <span className="font-medium text-foreground">
                  actually retaining
                </span>{" "}
                patterns and techniques.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
