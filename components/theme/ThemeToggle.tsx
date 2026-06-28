"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="block h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.75v2.5" />
      <path d="M12 18.75v2.5" />
      <path d="M2.75 12h2.5" />
      <path d="M18.75 12h2.5" />
      <path d="M5.45 5.45l1.77 1.77" />
      <path d="M16.78 16.78l1.77 1.77" />
      <path d="M18.55 5.45l-1.77 1.77" />
      <path d="M7.22 16.78l-1.77 1.77" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="block h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.8A8.8 8.8 0 1 1 11.2 3a7.2 7.2 0 1 0 9.8 9.8Z" />
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
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
        {isDark ? <MoonIcon /> : <SunIcon />}
      </span>

      <span className="leading-none">{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}