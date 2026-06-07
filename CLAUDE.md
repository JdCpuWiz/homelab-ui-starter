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
- Prisma 5 + Postgres on shared cluster `192.168.7.223:6432` (PgBouncer),
  db name `__APP_DB__`
- pino structured logging (`lib/logger.ts`)

## Domains & Ports

- Public: `https://__APP_NAME__.deckerzoo.com` (Traefik + tinyauth) — TODO
- Host port: `__APP_PORT__` → container `3000`
- Container: `__APP_HOST__`

## Commands

```bash
npm install
cp .env.example .env  # fill DATABASE_URL
npx prisma db push    # sync schema
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
- `entrypoint.sh` runs `prisma db push` WITHOUT `--accept-data-loss` —
  destructive schema changes should fail loudly. Temp-add the flag for
  an intentional drop, then revert before merge.
- Brand orange `#ff9900` is identity-only. Status pills use the global
  solid-color palette per `~/.claude/CLAUDE.md`.
