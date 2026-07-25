import express from "express";

import {
  register,
  login,
  me,
  updateProfile,
  uploadCV,
  toggleSavedJob,
  getSavedJobs,
  uploadResume,
  uploadAvatar,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";

import upload from "../middleware/upload.middleware.js";
import uploadAvatarMiddleware from "../middleware/uploadAvatar.middleware.js";

const router = express.Router();

// Auth
router.post("/register", register);
router.post("/login", login);

// Kullanıcı Bilgileri
router.get("/me", protect, me);
router.put("/profile", protect, updateProfile);

// CV Yükleme
router.post(
  "/upload-cv",
  protect,
  upload.single("cv"),
  uploadCV
);

// Resume Yükleme
router.post(
  "/upload-resume",
  protect,
  upload.single("resume"),
  uploadResume
);

// Avatar Yükleme
router.post(
  "/upload-avatar",
  protect,
  uploadAvatarMiddleware.single("avatar"),
  uploadAvatar
);

// Favori İlanlar
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