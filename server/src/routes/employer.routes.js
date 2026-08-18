import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

import {
  getEmployerDashboard,
  getCompanyProfile,
  updateCompanyProfile,
} from "../controllers/employer.controller.js";

const router = express.Router();

// Employer Dashboard
router.get(
  "/dashboard",
  protect,
  authorize("employer"),
  getEmployerDashboard
);

// Şirket profili
router.get(
  "/company",
  protect,
  authorize("employer"),
  getCompanyProfile
);

// Şirket profili güncelle
router.put(
  "/company",
  protect,
  authorize("employer"),
  updateCompanyProfile
);

export default router;