import dotenv from "dotenv";

dotenv.config();

const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production";

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv,
  isProduction,
  port: Number(process.env.PORT || 5000),
  appName: process.env.APP_NAME?.trim() || "invoice-generator-api",
  databaseUrl: required("DATABASE_URL"),
  directUrl: process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim() || required("DATABASE_URL"),
  frontendUrl: process.env.FRONTEND_URL?.trim() || "http://localhost:3000",
  resendApiKey: process.env.RESEND_API_KEY?.trim(),
  emailFrom: process.env.EMAIL_FROM?.trim() || "Invoice Generator <onboarding@resend.dev>",
  allowedOrigins: (process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || "http://localhost:3000")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
  logLevel: process.env.LOG_LEVEL?.trim() || "info",
  jwtSecret: required("JWT_SECRET"),
};

if (!Number.isInteger(env.port) || env.port < 1 || env.port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

if (isProduction && env.frontendUrl.startsWith("http://localhost")) {
  throw new Error("FRONTEND_URL must use the deployed frontend URL in production");
}

if (isProduction) {
  const origins = [env.frontendUrl, ...env.allowedOrigins];
  if (origins.some((origin) => !origin.startsWith("https://"))) {
    throw new Error("FRONTEND_URL and ALLOWED_ORIGINS must use HTTPS in production");
  }

  if (!env.resendApiKey || !env.emailFrom) {
    throw new Error("RESEND_API_KEY and EMAIL_FROM are required in production");
  }
}
