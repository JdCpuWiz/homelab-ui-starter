import type { Metadata } from "next";
import "@jdcpuwiz/homelab-ui/globals.css";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

// NO FONT WIRING — that is deliberate, not an omission.
//
// The fleet standard is the platform system stack (Wiz ruling 2026-07-23,
// Change #345). The `--hl-font-sans` / `--hl-font-mono` / `--hl-font-display`
// tokens come in with the homelab-ui globals.css imported above, so importing
// it IS the font setup. Do NOT add a next/font loader here: a scaffolded app
// that loads a webfont renders off-standard.
//
// The one exception is a deliberate display accent (a kiosk clock, a hero) —
// load that face in THIS file (next/font is build-time and can't be
// re-exported from a library) and override `--hl-font-display` only.

export const metadata: Metadata = {
  title: "__APP_NAME__",
  description: "Scaffolded from homelab-ui-starter.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
