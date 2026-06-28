"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 block h-[21px] w-[21px] -translate-x-1/2 -translate-y-1/2"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
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
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 block h-[22px] w-[22px] -translate-x-1/2 -translate-y-1/2"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.6 14.1A8.2 8.2 0 0 1 9.9 3.4a8.7 8.7 0 1 0 10.7 10.7Z" />
    </svg>
  );
}

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
      className="inline-flex h-16 items-center gap-4 rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 pr-7 text-[15px] font-semibold text-[var(--text-secondary)] shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
    >
      <span className="relative h-11 w-11 shrink-0 rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
        {isDark ? <MoonIcon /> : <SunIcon />}
      </span>

      <span className="leading-none">{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}