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

router.post(
  "/",
  protect,
  authorize("candidate"),
  applyJob
);

router.get(
  "/my-applications",
  protect,
  getMyApplications
);

router.get(
  "/job/:jobId",
  protect,
  authorize("employer", "admin"),
  getApplicationsForJob
);

router.patch(
  "/:id/status",
  protect,
  authorize("employer", "admin"),
  updateApplicationStatus
);

export default router;