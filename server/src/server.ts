import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import prisma from "./config/db";
import { env } from "./config/env";
import logger from "./lib/logger";
import authRoutes from "./modules/auth/auth.routes";
import profileRoutes from "./modules/profile/profile.routes";
import clientRoutes from "./modules/client/client.routes";
import invoiceRoutes from "./modules/invoice/invoice.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use((req, _res, next) => {
  const startedAt = Date.now();
  _res.on("finish", () => {
    logger.info(`${req.method} ${req.originalUrl} ${_res.statusCode} - ${Date.now() - startedAt}ms`);
  });
  next();
});

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || env.allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    logger.warn(`Blocked CORS request from origin: ${origin}`);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("Backend API Running");
});

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: "ok",
      service: env.appName,
      database: "connected",
    });
  } catch (error) {
    logger.error("Health check database query failed", error);
    res.status(503).json({
      status: "error",
      service: env.appName,
      database: "unavailable",
    });
  }
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error("Unhandled error", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

const server = app.listen(env.port, () => {
  logger.info(`Server running on port ${env.port}`);
});

const shutdown = async (signal: string) => {
  logger.info(`${signal} received, shutting down`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
