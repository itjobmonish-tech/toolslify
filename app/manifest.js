export default function manifest() {
  return {
    name: "Toolslify",
    short_name: "Toolslify",
    description:
      "Fast online calculators for salary, mortgage, tax, cost of living, home projects, health, math, time, conversions, cooking, and everyday planning.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
