import express from "express";
import { register, login, me , updateProfile, uploadCV,toggleSavedJob,
getSavedJobs, } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
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

router.get("/me", protect, me);

router.put("/profile", protect, updateProfile);

router.post(
  "/upload-cv",
  protect,
  upload.single("cv"),
  uploadCV
);

export default router;