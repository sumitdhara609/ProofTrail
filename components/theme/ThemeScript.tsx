export function ThemeScript() {
  const script = `
    (function () {
      try {
        var storedTheme = localStorage.getItem("prooftrail-theme");
        var theme = storedTheme === "dark" ? "dark" : "light";

        if (theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }

        document.documentElement.dataset.theme = theme;
      } catch (error) {
        document.documentElement.classList.remove("dark");
        document.documentElement.dataset.theme = "light";
      }
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}