import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";

// REPLACE the fonts with the closest free Google Fonts to the reference site
// (see references/style-extraction.md font cheat-sheet). Keep the CSS var names.
const sans = Inter({ subsets: ["latin"], variable: "--f-sans", display: "swap" });
const serif = Newsreader({
  subsets: ["latin"],
  variable: "--f-serif",
  display: "swap",
  style: ["normal", "italic"],
  // some Google fonts (Newsreader) lack next/font fallback metrics -> noisy
  // "Failed to find font override values" warning. Harmless; silence it.
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  // REPLACE with the user's product name + one-line description.
  title: "Demo",
  description: "A styled demo landing page.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
