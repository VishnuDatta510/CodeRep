"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Use setTimeout to avoid cascading render warning
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <button
        className="relative h-9 w-9 rounded-full border border-border bg-background flex items-center justify-center"
        aria-label="Toggle theme"
      >
        <div className="h-4 w-4" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const x = e.clientX;
    const y = e.clientY;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const newTheme = isDark ? "light" : "dark";

    // Check if View Transitions API is available
    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    const transition = document.startViewTransition(() => {
      setTheme(newTheme);
    });

    await transition.ready;

    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];

    document.documentElement.animate(
      {
        clipPath: isDark ? clipPath : [...clipPath].reverse(),
      },
      {
        duration: 500,
        easing: "ease-in-out",
        pseudoElement: isDark
          ? "::view-transition-new(root)"
          : "::view-transition-old(root)",
      },
    );
  };

  return (
    <button
      ref={ref}
      onClick={toggleTheme}
      className="theme-toggle relative h-9 w-9 rounded-full border border-border bg-background hover:bg-accent flex items-center justify-center transition-colors"
      type="button"
      title="Toggle theme"
      aria-label="Toggle theme"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        width="1.15em"
        height="1.15em"
        fill="currentColor"
        viewBox="0 0 32 32"
        className="theme-toggle__icon"
      >
        {isDark ? (
          /* Moon icon for dark mode */
          <path d="M27.5 11.5v-7h-7L16 0l-4.5 4.5h-7v7L0 16l4.5 4.5v7h7L16 32l4.5-4.5h7v-7L32 16l-4.5-4.5zM16 25.4a9.39 9.39 0 1 1 0-18.8 9.39 9.39 0 1 1 0 18.8z" />
        ) : (
          /* Sun icon with filled center for light mode */
          <>
            <path d="M27.5 11.5v-7h-7L16 0l-4.5 4.5h-7v7L0 16l4.5 4.5v7h7L16 32l4.5-4.5h7v-7L32 16l-4.5-4.5zM16 25.4a9.39 9.39 0 1 1 0-18.8 9.39 9.39 0 1 1 0 18.8z" />
            <circle cx="16" cy="16" r="8.1" />
          </>
        )}
      </svg>
    </button>
  );
}
