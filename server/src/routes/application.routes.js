import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

import {
  applyJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
} from "../controllers/application.controller.js";

const router = express.Router();

// Aday başvuru yapar
router.post(
  "/",
  protect,
  authorize("candidate"),
  applyJob
);

// Aday kendi başvurularını görür
router.get(
  "/my-applications",
  protect,
  authorize("candidate", "admin"),
  getMyApplications
);

// İşveren/Admin ilanın başvurularını görür
router.get(
  "/job/:jobId",
  protect,
  authorize("employer", "admin"),
  getApplicationsForJob
);

// İşveren/Admin başvuru durumunu günceller
router.patch(
  "/:id/status",
  protect,
  authorize("employer", "admin"),
  updateApplicationStatus
);

export default router;