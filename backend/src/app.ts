import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { router } from "./routes/index.js";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: process.env.ADMIN_CORS_ORIGIN ?? "http://localhost:3000"
    })
  );
  app.use(helmet());
  app.use(compression());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/v1", router);

  return app;
};
