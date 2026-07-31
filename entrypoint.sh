#!/bin/sh
set -e

PUID=${PUID:-1000}
PGID=${PGID:-1000}

# Create group + user matching the host's owner of the bind-mounted ./data
# so Pawzitive (the offsite backup tool) can read everything without the
# container running as root.
addgroup -g "$PGID" appgroup 2>/dev/null || true
adduser -D -u "$PUID" -G appgroup appuser 2>/dev/null || true

# Ensure DATA_ROOT exists and is owned by the app user (handles fresh
# volumes + ownership drift after host-side chowns).
mkdir -p /app/data
chown -R "$PUID:$PGID" /app/data \
  /app/node_modules/.prisma \
  /app/node_modules/@prisma \
  /app/node_modules/prisma

# Sync schema (via DIRECT_URL — the pooler can't run migrations) then start
# the server. NON-FATAL: `db push` failure is swallowed into a log line so an
# unreachable direct Postgres (:5433) WARNS instead of crash-looping the
# container. :5433 is actually LAN-reachable and password-gated on the shared
# cluster (BUG #181 — not localhost-only, despite older docs here claiming
# otherwise), so this should rarely fire; when it does, run `prisma db push`
# yourself against DIRECT_URL to see why.
# NO --accept-data-loss — a destructive change should still fail that manual
# push loudly so you can review the diff before forcing it.
# BUG #219: non-fatal also means SILENT — nothing else in the boot path reads
# this result, and /healthz's SELECT 1 can't see a stale schema either. The
# deploy playbook greps the container's boot logs for the failure string
# below and fails loudly if it's there.
exec su-exec "$PUID:$PGID" sh -c \
  'node node_modules/prisma/build/index.js db push || echo "[entrypoint] prisma db push failed (run it manually against DIRECT_URL) — continuing"; node server.js'
