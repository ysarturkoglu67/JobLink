import express from "express";

import { protect } from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/admin.middleware.js";

import {
  getDashboard,
  getDashboardCharts,
  getUsers,
  deleteUser,
  getJobs,
  deleteJob,
  toggleUserStatus,
  verifyEmployer,
} from "../controllers/admin.controller.js";

const router = express.Router();

// =====================================================
// ADMIN AUTH
// =====================================================

router.use(protect);
router.use(adminOnly);

// =====================================================
// DASHBOARD
// =====================================================

router.get("/dashboard", getDashboard);

router.get(
  "/charts",
  getDashboardCharts
);

// =====================================================
// USERS
// =====================================================

router.get(
  "/users",
  getUsers
);

router.delete(
  "/users/:id",
  deleteUser
);

router.patch(
  "/users/:id/status",
  toggleUserStatus
);

router.patch(
  "/users/:id/verify",
  verifyEmployer
);

// =====================================================
// JOBS
// =====================================================

router.get(
  "/jobs",
  getJobs
);

router.delete(
  "/jobs/:id",
  deleteJob
);

export default router;