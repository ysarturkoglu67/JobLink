import express from "express";

import {
  register,
  login,
  updateProfile,
  me,
  uploadCV,
  uploadResume,
  uploadAvatar,
  toggleSavedJob,
  getSavedJobs,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";

import upload from "../middleware/upload.middleware.js";
import uploadAvatarMiddleware from "../middleware/uploadAvatar.middleware.js";
import uploadCVMiddleware from "../middleware/uploadCV.js";

const router = express.Router();

/* ==========================
   AUTH
========================== */

router.post("/register", register);
router.post("/login", login);

/* ==========================
   USER
========================== */

router.get("/me", protect, me);

router.put(
  "/profile",
  protect,
  updateProfile
);

/* ==========================
   AVATAR
========================== */

router.post(
  "/upload-avatar",
  protect,
  uploadAvatarMiddleware.single("avatar"),
  uploadAvatar
);

/* ==========================
   CV
========================== */

router.post(
  "/upload-cv",
  protect,
  uploadCVMiddleware.single("cv"),
  uploadCV
);

/* ==========================
   RESUME (PDF)
========================== */

router.post(
  "/upload-resume",
  protect,
  upload.single("resume"),
  uploadResume
);

/* ==========================
   SAVED JOBS
========================== */

router.post(
  "/saved-jobs",
  protect,
  toggleSavedJob
);

router.get(
  "/saved-jobs",
  protect,
  getSavedJobs
);

export default router;