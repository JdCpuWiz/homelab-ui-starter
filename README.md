# homelab-ui-starter

GitHub Template repo for new homelab web projects. Scaffolds a Next.js
16 + TypeScript strict + Tailwind v3 app pre-wired with
[`@jdcpuwiz/homelab-ui`](https://www.npmjs.com/package/@jdcpuwiz/homelab-ui)
— fonts, sidebar shell, design tokens, Prisma stub, Dockerfile,
entrypoint, compose, ansible deploy playbook, all of it.

## Quickstart (3 steps)

```bash
# 1. Spawn a fresh repo from the template
gh repo create JdCpuWiz/my-app --template JdCpuWiz/homelab-ui-starter --private --clone
cd my-app

# 2. Run the init script — sed-replaces __APP_NAME__ / __APP_PORT__ /
#    __APP_HOST__ / __APP_DB__ across every file and renames
#    ansible/deploy-__APP_NAME__.yml.
./bin/init my-app

# 3. Install + boot
npm install
npm run dev     # http://localhost:3xxx
```

That's it. The landing page renders in the standard three-face typography,
the canonical sidebar, and a stamped version footer. From here, edit
`app/page.tsx`, `components/AppShell.tsx`, and `prisma/schema.prisma`
to build your app.

## What `bin/init` does

Prompts for:
- **Project slug** — lowercase-with-hyphens, used in container/DB name
- **Host port** — exposed by docker compose (e.g. `3050`)
- **Deploy host** — short label for `CLAUDE.md` (e.g. `pve1 CT 100`)
- **DB name** — defaults to slug with underscores (e.g. `my_app`)

Then runs sed across `package.json`, `compose.yaml`, `app/layout.tsx`,
`app/page.tsx`, `lib/logger.ts`, `ansible/deploy-__APP_NAME__.yml`,
`CLAUDE.md`, `README.md`, `.env.example`, `DESIGN.md`. Renames the
ansible playbook to `deploy-<slug>.yml`. Stages a `chore: init from
homelab-ui-starter` commit and stops — you commit it when you're ready.

## What's pre-wired

- **Fonts** — the sanctioned **three faces by job** (Wiz ruling 2026-07-24,
  BuildPlan #57, superseding Change #345's system-ui-only rule): **Poppins**
  for everything read, **Orbitron** for big numbers only (`>= ~1.5rem`),
  **JetBrains Mono** for small values and code. `app/layout.tsx` already
  wires all three via `next/font` and puts the variables on `<html>`.
  **Leave that wiring in place** — the package names the faces in its
  `--hl-font-*` tokens but ships no font files, and next/font cannot be
  re-exported from a library, so the loaders have to live in your app
  source. Strip them and the tokens resolve to nothing and the browser
  falls back silently: correct-looking in review, wrong on screen.
- **Tailwind preset** — `@jdcpuwiz/homelab-ui/tailwind-preset` applied
  in `tailwind.config.ts`. Override tokens at `:root` in
  `app/globals.css`.
- **Sidebar shell** — `components/AppShell.tsx` uses the package
  `<Sidebar>` with a single Home nav item. Add yours.
- **Prisma** — `lib/prisma.ts` singleton (capped via DATABASE_URL),
  `prisma/schema.prisma` datasource + generator stub.
- **/api/healthz** — DB probe (200 with `{app: "ok", db: "ok"}` /
  503 on DB down).
- **Logging** — pino baseline in `lib/logger.ts`. JSON in prod, pretty
  in dev.
- **Dockerfile** — multi-stage Next standalone build. openssl + su-exec
  baked in; uncomment `poppler-utils` line if you need PDF thumbnails.
- **entrypoint.sh** — PUID/PGID drop + `prisma db push` (no
  `--accept-data-loss`).
- **compose.yaml** — single service + `./data:/app/data` volume +
  DATABASE_URL env.
- **ansible/deploy-`__APP_NAME__`.yml** — git pull + `docker compose
  up -d --build` + `/healthz` probe + a boot-log check that fails loudly
  if `prisma db push` silently failed (BUG #219 — `/healthz` alone can't
  see a stale schema).

## After running `bin/init`

1. Create the Postgres DB on `192.168.7.223`:
   `createdb -h 192.168.7.223 -U postgres <db-name>`
2. Provision the container host (or pick an existing LXC), add it to
   `ansible-scripts` inventory under the project's slug.
3. On the host: `mkdir -p /home/shad/docker/<slug>/data` and clone the
   repo, then copy `.env.example` → `.env` and fill `DATABASE_URL`.
4. From the dev box: `ansible-playbook ansible/deploy-<slug>.yml`.

## License

MIT
