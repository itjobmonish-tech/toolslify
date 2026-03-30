(function () {
  try {
    var savedTheme = localStorage.getItem("toolslify-theme");
    var theme = savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
  } catch (error) {
    document.documentElement.dataset.theme = "light";
  }
})();
