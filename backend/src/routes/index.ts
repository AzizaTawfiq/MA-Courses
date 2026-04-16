import { Router } from "express";

export const router = Router();

router.get("/", (_req, res) => {
  res.json({
    name: "MA Training API",
    version: "v1",
    status: "ready"
  });
});
