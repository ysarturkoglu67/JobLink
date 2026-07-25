import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getEmployerDashboard } from "../controllers/employer.controller.js";

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  getEmployerDashboard
);

export default router;