"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("prooftrail-theme");
    const activeTheme: Theme = storedTheme === "dark" ? "dark" : "light";

    setTheme(activeTheme);
    document.documentElement.classList.toggle("dark", activeTheme === "dark");
    document.documentElement.dataset.theme = activeTheme;
    setMounted(true);
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
    localStorage.setItem("prooftrail-theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.dataset.theme = nextTheme;
  }

  const visibleTheme = mounted ? theme : "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-xs font-semibold text-[var(--text-secondary)] shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
    >
      <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
        {visibleTheme === "dark" ? "☾" : "☀"}
      </span>
      <span>{visibleTheme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}