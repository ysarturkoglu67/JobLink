import express from "express";
import { authorize } from "../middleware/role.middleware.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
} from "../controllers/job.controller.js";


const router = express.Router();

router.get("/", getJobs);
router.get("/my-jobs", protect, getMyJobs);
router.get("/:id", getJobById);
router.post(
  "/",
  protect,
  authorize("Employer", "Admin"),
  createJob
);
router.put(
  "/:id",
  protect,
  authorize("Employer", "Admin"),
  updateJob
);
router.delete(
  "/:id",
  protect,
  authorize("Employer", "Admin"),
  deleteJob
);


export default router;