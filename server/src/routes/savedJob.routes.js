import express from "express";

import {
  saveJob,
  getSavedJobs,
  removeSavedJob,
  checkSavedJob,
} from "../controllers/savedJob.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// ==========================================
// FAVORİLERİ GETİR
// GET /saved-jobs
// ==========================================

router.get(
  "/",
  protect,
  getSavedJobs
);

// ==========================================
// FAVORİYE EKLE
// POST /saved-jobs
// ==========================================

router.post(
  "/",
  protect,
  saveJob
);

// ==========================================
// FAVORİ DURUMUNU KONTROL ET
// GET /saved-jobs/check/:jobId
// ==========================================

router.get(
  "/check/:jobId",
  protect,
  checkSavedJob
);

// ==========================================
// FAVORİDEN ÇIKAR
// DELETE /saved-jobs/:jobId
// ==========================================

router.delete(
  "/:jobId",
  protect,
  removeSavedJob
);

export default router;