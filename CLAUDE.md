# __APP_NAME__ — Claude Notes

## What this is

TODO — one-sentence description of what __APP_NAME__ does.

## What this is NOT

TODO — common confusions to disambiguate (e.g. "NOT auth-aware — Traefik
tinyauth handles SSO at the edge; never add next-auth").

## Stack

- Next.js 16 (App Router) + TypeScript strict
- Tailwind v3 + `@jdcpuwiz/homelab-ui` preset (do NOT swap to Tailwind v4
  until the package ships a v4 variant)
- Prisma 5 + Postgres on shared cluster via PgBouncer `192.168.7.223:5432`
  (TRANSACTION mode → `pgbouncer=true` on DATABASE_URL). Migrations use a
  direct connection `:5433` (DIRECT_URL). db name `__APP_DB__`. The pooler
  uses auth_query (#169), so a new DB role works as soon as it exists.
- pino structured logging (`lib/logger.ts`)

## Domains & Ports

- Public: `https://__APP_NAME__.deckerzoo.com` (Traefik + tinyauth) — TODO
- Host port: `__APP_PORT__` → container `3000`
- Container: `__APP_HOST__`

## Commands

```bash
npm install
cp .env.example .env  # fill DATABASE_URL (pooler :5432) + DIRECT_URL (:5433)
npx prisma db push    # sync schema — uses DIRECT_URL (the pooler can't migrate)
npm run dev           # http://localhost:__APP_PORT__

npm run build
npm start
```

## Deployment

Auto-deploy via the `ansible-deployer` agent after every push:

```bash
ansible-playbook -i /home/shad/projects/ansible-scripts/automation/ansible/hosts/hosts.yaml \
  /home/shad/projects/__APP_NAME__/ansible/deploy-__APP_NAME__.yml
```

After registering the ansible host group `__APP_NAME__` in
`ansible-scripts`, copy `ansible/deploy-__APP_NAME__.yml` into
`ansible-scripts/automation/ansible/playbooks/` so the playbook path
matches the homelab convention.

## Design

Read `DESIGN.md` before touching any UI. The dark-theme standard lives in
`@jdcpuwiz/homelab-ui`. Invoke the global `ui-design-expert` agent for any
new component to verify it matches.

## Gotchas

- TODO — known gotchas (e.g. "Streaming uploads — don't `await
  file.arrayBuffer()` on large files, OOMs the container").
- `entrypoint.sh` runs `prisma db push` against DIRECT_URL, NON-FATAL so a
  boot where direct Postgres `:5433` is unreachable warns instead of
  crash-looping. `:5433` is actually LAN-reachable and password-gated on the
  shared cluster (BUG #181 — it is NOT localhost-only, despite what older
  copies of this comment claimed), so that should rarely fire; when it does,
  run `prisma db push` yourself against DIRECT_URL. Still NO
  `--accept-data-loss` — a destructive change should fail that manual push
  loudly. (Single-instance app with no real migrations? Consider SQLite-only
  and drop Prisma entirely, like pawtrol did.)
- The placeholder `StarterMarker` model's `@@map` must NOT start with an
  underscore — Prisma 5.22 can't re-introspect an autoincrement column whose
  sequence name begins with `_`, so `db push` succeeds once then fails on
  every push after (BUG #219). If you rename the placeholder before deleting
  it, keep the leading-underscore-free table name. And because the push is
  non-fatal, a broken push is invisible unless something reads the boot
  logs — the deploy playbook's "Read container logs for the schema-push
  result" task does this; don't remove it.
- Brand orange `#ff9900` is identity-only. Status pills use the global
  solid-color palette per `~/.claude/CLAUDE.md`.
