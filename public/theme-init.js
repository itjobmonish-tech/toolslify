(function () {
  try {
    localStorage.setItem("toolslify-theme", "light");
    document.documentElement.dataset.theme = "light";
    document.documentElement.classList.remove("dark");
  } catch (error) {
    document.documentElement.dataset.theme = "light";
    document.documentElement.classList.remove("dark");
  }
})();
