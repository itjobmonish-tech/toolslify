export default function manifest() {
  return {
    name: "Toolslify",
    short_name: "Toolslify",
    description:
      "Premium AI utility suite for humanizing text, generating assignments, summarizing meetings, converting voice notes, and extracting value from PDFs.",
    start_url: "/",
    display: "standalone",
    background_color: "#07131f",
    theme_color: "#0f766e",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
