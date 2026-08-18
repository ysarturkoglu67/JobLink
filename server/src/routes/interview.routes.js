import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

import {
  createInterview,
  getEmployerInterviews,
  getCandidateInterviews,
  updateInterview,
  cancelInterview,
} from "../controllers/interview.controller.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("employer"),
  createInterview
);

router.get(
  "/employer",
  protect,
  authorize("employer"),
  getEmployerInterviews
);

router.get(
  "/candidate",
  protect,
  authorize("candidate"),
  getCandidateInterviews
);

router.put(
  "/:id",
  protect,
  authorize("employer"),
  updateInterview
);

router.delete(
  "/:id",
  protect,
  authorize("employer"),
  cancelInterview
);

export default router;