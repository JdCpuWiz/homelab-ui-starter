import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "@jdcpuwiz/homelab-ui/globals.css";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

// next/font/google is a build-time directive — the loader calls MUST
// be declared as `const X = Font(...)` in the consumer's app source.
// Re-exporting from @jdcpuwiz/homelab-ui doesn't work (the package's
// SWC plugin needs literal const syntax). Don't refactor this away.
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const orbitron = Orbitron({ variable: "--font-orbitron", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "__APP_NAME__",
  description: "Scaffolded from homelab-ui-starter.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} antialiased`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
