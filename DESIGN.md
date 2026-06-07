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
- **Geist + Geist Mono + Orbitron** wired via the snippet in `app/layout.tsx`
- **Sidebar shell** at w-60 default (override `--hl-sidebar-width` per project)
- **Logo block** w-36 h-36 centered, px-4 pt-6 pb-5, border-b-2
- **Page-title purple** `#aa89b7` (h1 only — `text-title`)
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
