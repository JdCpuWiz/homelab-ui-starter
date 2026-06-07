import pino from "pino";

/**
 * Structured logger. JSON in prod, pretty in dev. Wire into route
 * handlers as `logger.info({ event: "...", ... })`, not console.log.
 */
export const logger = pino({
  level: process.env.LOG_LEVEL ?? (process.env.NODE_ENV === "production" ? "info" : "debug"),
  base: { app: process.env.APP_NAME ?? "__APP_NAME__" },
  transport:
    process.env.NODE_ENV !== "production"
      ? { target: "pino-pretty", options: { colorize: true, translateTime: "SYS:HH:MM:ss.l" } }
      : undefined,
});
