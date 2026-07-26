# __APP_NAME__ — Design

This project consumes the canonical homelab design system from
`@jdcpuwiz/homelab-ui`. The full spec lives at the package — this file
documents project-specific deviations only.

## What you get from the package (no config needed)

- **Dark theme** (`html.dark` + `--hl-background: #0f0f0f`)
- **Brand orange** `#ff9900` — identity only, NEVER status semantics
- **Status palette** (solid + white text, except yellow/primary which use black):
  - Active / OK / Success → `#15803d`
  - Info / In Progress    → `#1d4ed8`
  - Warning / Low         → `#eab308` *(black text)*
  - Danger / Critical     → `#b91c1c`
  - Shipped / Special     → `#6d28d9`
  - Neutral / Disabled    → `#6b7280`
  - Empty / Unknown       → `#4b5563`
  - Primary / Brand       → `#ff9900` *(black text)*
- **Typography: three faces by job** (Wiz ruling 2026-07-24, BuildPlan #57 —
  supersedes the brief system-ui-only ruling in Change #345):
  - `--hl-font-sans` → **Poppins** — body, UI, headings, labels. Everything read.
  - `--hl-font-display` → **Orbitron** — big numbers ONLY, `>= ~1.5rem`
    (stat heroes, clocks). Never on text labels, never below that size.
  - `--hl-font-mono` → **JetBrains Mono** — small values, version stamps,
    code, `< ~1.5rem`.

  The package NAMES these in its tokens but ships no font files. **`app/layout.tsx`
  must load them via `next/font`** — that wiring is required, not optional, and
  the scaffold already includes it. Do not remove it: without the loaders the
  token names resolve to nothing and the browser falls back silently, which
  reads as correct in code review and is wrong on screen.
- **Text colour: one flat `#f0f1f4`** for everything read. The opacity ramp
  (`text-white/30`–`/80`) is dead — hierarchy comes from size and weight only.
  `#ff9900` for numeric values, `#7d838d` for input placeholders ONLY.
- **Sidebar shell** at w-60 default (override `--hl-sidebar-width` per project)
- **Logo block** w-36 h-36 centered, px-4 pt-6 pb-5, border-b-2
- **Radii aliases**: `rounded-widget` (xl), `rounded-row` (lg), `rounded-chip`, `rounded-panel` (2xl)

## Project overrides

Add `:root` overrides to `app/globals.css`. Common ones:

```css
:root {
  --hl-sidebar-width: 18rem;   /* roomier sidebar for long folder names */
  --hl-brand: #00aaff;         /* re-skin brand to blue */
}
```

## When to lift a pattern into the package

If you build a component that another homelab project would also want,
upstream it to `@jdcpuwiz/homelab-ui` instead of keeping it local. Open
an issue at the package repo with the use case.
