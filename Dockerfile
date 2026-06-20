# __APP_NAME__ — multi-stage Next.js standalone build.
# Lifted from the canonical asset-den / home-stack Dockerfile.

FROM node:20-alpine AS base
WORKDIR /app

# ── deps ──────────────────────────────────────────────────────────────────
FROM base AS deps
COPY package.json package-lock.json* ./
# prisma/ must be present before `npm install` because the `postinstall`
# hook runs `prisma generate`, which needs the schema. Without this the
# deps stage aborts with "Could not find Prisma Schema". (The builder
# stage regenerates the client with openssl present.)
COPY prisma ./prisma
RUN npm install --no-audit --no-fund

# ── builder ───────────────────────────────────────────────────────────────
FROM base AS builder
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules

ARG GIT_SHA=unknown
RUN echo "Building for $GIT_SHA"

COPY . .
RUN npx prisma generate
RUN npm run build

# ── runner ────────────────────────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production

# openssl: Prisma needs it on Alpine.
# su-exec: drop privileges at runtime.
# Uncomment poppler-utils if you need pdftoppm for PDF thumbnails:
# RUN apk add --no-cache openssl su-exec poppler-utils
RUN apk add --no-cache openssl su-exec

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["/entrypoint.sh"]
