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

# Sync schema then start the standalone server. NO --accept-data-loss —
# a destructive change should fail the deploy loudly so you can review
# the diff. Temp-add the flag for an intentional drop, then revert
# before merging.
exec su-exec "$PUID:$PGID" sh -c \
  'node node_modules/prisma/build/index.js db push && node server.js'
