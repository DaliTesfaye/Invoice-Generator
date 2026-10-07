import { env } from "../config/env";

const levelRank = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
} as const;

const currentLevel = levelRank[env.logLevel as keyof typeof levelRank] ?? levelRank.info;

function shouldLog(level: keyof typeof levelRank) {
  return levelRank[level] <= currentLevel;
}

function safeStringify(value: unknown): string {
  if (value === undefined) return "undefined";
  if (typeof value === "string") return value;

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

const log = (level: keyof typeof levelRank, message: string, meta?: unknown) => {
  if (!shouldLog(level)) {
    return;
  }

  const timestamp = new Date().toISOString();
  const payload = meta === undefined ? message : `${message} ${safeStringify(meta)}`;

  if (level === "error") {
    console.error(`[${timestamp}] ERROR`, payload);
    return;
  }

  if (level === "warn") {
    console.warn(`[${timestamp}] WARN`, payload);
    return;
  }

  if (level === "debug") {
    console.debug(`[${timestamp}] DEBUG`, payload);
    return;
  }

  console.log(`[${timestamp}] INFO`, payload);
};

const logger = {
  error: (message: string, meta?: unknown) => log("error", message, meta),
  warn: (message: string, meta?: unknown) => log("warn", message, meta),
  info: (message: string, meta?: unknown) => log("info", message, meta),
  debug: (message: string, meta?: unknown) => log("debug", message, meta),
};

export default logger;
