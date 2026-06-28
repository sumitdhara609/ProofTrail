"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("prooftrail-theme") as Theme | null;
    const activeTheme = storedTheme === "dark" ? "dark" : "light";

    setTheme(activeTheme);
    document.documentElement.classList.toggle("dark", activeTheme === "dark");
    setMounted(true);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
    localStorage.setItem("prooftrail-theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }

  const isDark = mounted && theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="inline-flex h-11 items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 pr-4 text-sm font-semibold text-[var(--text-secondary)] shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
        {isDark ? (
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="block h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.6 14.1A8.2 8.2 0 0 1 9.9 3.4a8.7 8.7 0 1 0 10.7 10.7Z" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="block h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2.8v2.4" />
            <path d="M12 18.8v2.4" />
            <path d="M2.8 12h2.4" />
            <path d="M18.8 12h2.4" />
            <path d="M5.5 5.5l1.7 1.7" />
            <path d="M16.8 16.8l1.7 1.7" />
            <path d="M18.5 5.5l-1.7 1.7" />
            <path d="M7.2 16.8l-1.7 1.7" />
          </svg>
        )}
      </span>

      <span className="leading-none tracking-[-0.01em]">
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
}