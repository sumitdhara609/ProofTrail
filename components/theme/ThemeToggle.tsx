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
      className="inline-flex h-16 items-center gap-4 rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 pr-7 text-[15px] font-semibold text-[var(--text-secondary)] shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
    >
      <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--accent-soft)]">
        {isDark ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            className="h-5 w-5 text-[var(--accent)]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12.79A9 9 0 1 1 11.21 3c-.04.33-.06.66-.06 1a9 9 0 0 0 9 9c.34 0 .67-.02 1-.06Z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            className="h-5 w-5 text-[var(--accent)]"
          >
            <circle cx="12" cy="12" r="4.2" />
            <path strokeLinecap="round" d="M12 2.5v2.2" />
            <path strokeLinecap="round" d="M12 19.3v2.2" />
            <path strokeLinecap="round" d="M4.93 4.93l1.56 1.56" />
            <path strokeLinecap="round" d="M17.51 17.51l1.56 1.56" />
            <path strokeLinecap="round" d="M2.5 12h2.2" />
            <path strokeLinecap="round" d="M19.3 12h2.2" />
            <path strokeLinecap="round" d="M4.93 19.07l1.56-1.56" />
            <path strokeLinecap="round" d="M17.51 6.49l1.56-1.56" />
          </svg>
        )}
      </span>

      <span className="text-[15px] font-semibold tracking-[-0.01em]">
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
}