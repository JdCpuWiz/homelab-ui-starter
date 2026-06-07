"use client";

import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { Sidebar, SidebarNavItem } from "@jdcpuwiz/homelab-ui";
import { version } from "../package.json";

/**
 * Single source of truth for the app's frame. Sidebar comes from the
 * shared @jdcpuwiz/homelab-ui package; add nav items + widgets as the
 * app grows.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        logoSrc="/logo.png"
        logoAlt="__APP_NAME__"
        nav={
          <SidebarNavItem
            label="Home"
            icon={<LayoutDashboard size={16} />}
            active
            href="/"
            render={({ href, className }, c) => (
              <Link href={href} className={className}>
                {c}
              </Link>
            )}
          />
        }
        footer={`v${version}`}
      />
      <main className="flex-1 overflow-y-auto bg-[var(--hl-content)] p-8">
        {children}
      </main>
    </div>
  );
}
