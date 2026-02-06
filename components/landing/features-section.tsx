import { Chrome, LayoutDashboard, Star } from "lucide-react";
import Image from "next/image";

const features = [
  {
    id: "extension",
    badge: "Chrome Extension",
    icon: Chrome,
    title: "Add Problems While You Solve",
    description:
      "Our Chrome extension sits right on LeetCode. One click adds any problem to your review queue. It detects when you submit a solution and prompts you to rate the difficulty - so your reviews are always personalized.",
    bullets: [
      "One-click add from any LeetCode problem page",
      "Auto-detects accepted submissions",
      "Rate difficulty to personalize your schedule",
    ],
    screenshotAlt: "Extension Screenshot",
    screenshot: "/extension.png",
    direction: "right" as const,
  },
  {
    id: "dashboard",
    badge: "Dashboard",
    icon: LayoutDashboard,
    title: "Track Everything in One Place",
    description:
      "Your dashboard shows all your problems, their review schedules, and your progress. Filter by difficulty, sort by next review date, and never lose track of what you need to practice.",
    bullets: [
      "See all problems and their review status",
      "Filter by difficulty and tracking status",
      "Clear overview of your spaced repetition progress",
    ],
    screenshotAlt: "Dashboard Screenshot",
    screenshot: "/dashboard.png",
    direction: "left" as const,
  },
  {
    id: "rating",
    badge: "Smart Scheduling",
    icon: Star,
    title: "Ratings That Shape Your Schedule",
    description:
      "After each review, rate how the problem felt: Failed, Hard, or Good. CodeRep adjusts the interval accordingly - problems you struggle with come back sooner, while easy ones are spaced further apart.",
    bullets: [
      "Three simple ratings: Failed, Hard, Good",
      "Intervals adapt based on your performance",
      "Struggling problems get more frequent reviews",
    ],
    screenshotAlt: "Rating Screenshot",
    screenshot: "/rating.png",
    direction: "right" as const,
  },
];

export function FeaturesSection() {
  return (
    <section id="how-it-works" className="border-b">
      <div className="mx-auto max-w-7xl px-8 py-32 md:py-40">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-base font-medium uppercase tracking-widest text-muted-foreground">
            How it works
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Three steps to never forgetting
          </h2>
          <p className="mt-5 text-xl text-muted-foreground">
            A seamless workflow from solving to scheduling to mastering.
          </p>
        </div>

        {/* Features */}
        <div className="mt-24 space-y-40">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`flex flex-col items-center gap-16 lg:gap-24 ${
                feature.direction === "right"
                  ? "lg:flex-row"
                  : "lg:flex-row-reverse"
              }`}
            >
              {/* Text */}
              <div className="flex-1 space-y-7">
                <div className="inline-flex items-center gap-2.5 rounded-full border bg-muted px-4 py-1.5 text-base font-medium">
                  <feature.icon className="size-5" />
                  {feature.badge}
                </div>

                <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {feature.title}
                </h3>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                <ul className="space-y-4 pt-3">
                  {feature.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-4 text-base">
                      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-primary-foreground">
                        {i + 1}
                      </span>
                      <span className="text-muted-foreground">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Screenshot Placeholder */}
              <div className="flex-1">
                <div className="relative overflow-hidden rounded-xl border bg-muted/50 shadow-lg">
                  <div className="flex h-8 items-center gap-1.5 border-b bg-muted px-4">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
                  </div>
                  <div className="relative flex aspect-5/3 items-center justify-center">
                    <Image
                      src={feature.screenshot}
                      alt={feature.screenshotAlt}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
