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
  authorize("Candidate"),
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
  getApplicationsForJob
);

router.patch(
  "/:id/status",
  protect,
  authorize("Employer", "Admin"),
  updateApplicationStatus
);
export default router;