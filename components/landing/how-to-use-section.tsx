import { Chrome, Plus, CalendarCheck, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Chrome,
    step: "01",
    title: "Install the Extension",
    description:
      "Add the CodeRep Chrome extension to your browser. Sign in with your API token to connect it to your account.",
  },
  {
    icon: Plus,
    step: "02",
    title: "Add Problems as You Solve",
    description:
      'Click "Add to CodeRep" on any LeetCode problem. The extension will track it and detect when you submit solutions.',
  },
  {
    icon: CalendarCheck,
    step: "03",
    title: "Review on Schedule",
    description:
      "Check your dashboard or extension popup daily. Problems appear when they're due - solve them and rate the difficulty.",
  },
  {
    icon: BarChart3,
    step: "04",
    title: "Watch Your Retention Grow",
    description:
      "As you consistently review, intervals grow longer. What once took daily practice becomes weekly, then monthly review.",
  },
];

export function HowToUseSection() {
  return (
    <section className="border-b">
      <div className="mx-auto max-w-7xl px-8 py-32 md:py-40">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-base font-medium uppercase tracking-widest text-muted-foreground">
            Getting started
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            How to Use CodeRep Effectively
          </h2>
          <p className="mt-5 text-xl text-muted-foreground">
            Four simple steps to build lasting problem-solving skills.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-24">
          {/* Connector line */}
          <div className="absolute left-8 top-0 hidden h-full w-px bg-border lg:left-1/2 lg:block" />

          <div className="grid gap-16 lg:grid-cols-2 lg:gap-y-24">
            {steps.map((step, index) => (
              <div
                key={step.step}
                className={`relative ${
                  index % 2 === 0
                    ? "lg:pr-16 lg:text-right"
                    : "lg:col-start-2 lg:pl-16"
                }`}
              >
                {/* Step indicator on connector */}
                <div
                  className={`absolute top-0 hidden h-10 w-10 items-center justify-center rounded-full border-4 border-background bg-primary text-sm font-bold text-primary-foreground lg:flex ${
                    index % 2 === 0 ? "lg:-right-5 lg:left-auto" : "lg:-left-5"
                  }`}
                >
                  {step.step}
                </div>

                <div
                  className={`space-y-4 ${
                    index % 2 === 0 ? "lg:items-end" : "lg:items-start"
                  }`}
                >
                  {/* Mobile step number */}
                  <div className="flex items-center gap-4 lg:hidden">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
                      {step.step}
                    </div>
                    <step.icon className="size-6 text-muted-foreground" />
                  </div>

                  {/* Desktop icon */}
                  <div
                    className={`hidden items-center gap-2 lg:flex ${
                      index % 2 === 0 ? "justify-end" : ""
                    }`}
                  >
                    <step.icon className="size-6 text-muted-foreground" />
                  </div>

                  <h3 className="text-2xl font-semibold">{step.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
