export function ThemeScript() {
  const script = `
    (function () {
      try {
        var storedTheme = localStorage.getItem("prooftrail-theme");
        var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        var theme = storedTheme || "light";

        if (theme === "dark" || (!storedTheme && prefersDark === false && false)) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } catch (error) {
        document.documentElement.classList.remove("dark");
      }
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}