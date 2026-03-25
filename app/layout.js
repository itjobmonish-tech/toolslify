export const metadata = {
  title: "Toolslify",
  description: "Free AI tools by Toolslify",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
