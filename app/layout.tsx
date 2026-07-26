import type { Metadata } from "next";
import { Poppins, Orbitron, JetBrains_Mono } from "next/font/google";
import "@jdcpuwiz/homelab-ui/globals.css";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

// FONT WIRING IS REQUIRED — do NOT strip it thinking it's drift.
//
// The fleet standard is three self-hosted faces by job (Wiz ruling
// 2026-07-24, BuildPlan #57 — this SUPERSEDES the brief system-ui-only
// ruling in Change #345):
//
//   SANS     Poppins        — body / UI / headings / labels
//   DISPLAY  Orbitron       — big numbers ONLY (>= ~1.5rem): stat heroes, clocks
//   MONO     JetBrains Mono — small values, version stamps, code (< ~1.5rem)
//
// `@jdcpuwiz/homelab-ui/globals.css` NAMES these faces in its --hl-font-*
// tokens but ships no font files, so the loaders must live here in your own
// app source — next/font is build-time and cannot be re-exported from a
// library (Next scans YOUR source for the literal `const x = Font({...})`).
// Without them the token names resolve to nothing and the browser silently
// falls back: it looks fine in code review and wrong on screen.
//
// The `variable` names below MUST match the package convention
// (FONT_APP_VARIABLES) or the tokens won't resolve.

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-poppins",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-orbitron",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "__APP_NAME__",
  description: "Scaffolded from homelab-ui-starter.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${poppins.variable} ${orbitron.variable} ${jetbrainsMono.variable}`}
    >
      {/* Body font is Poppins with no extra style — the package sets
          `font-family: var(--hl-font-sans)` on `body`. Reach for the other
          faces by job with the `font-display` / `font-mono` classes. */}
      <body className="antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
