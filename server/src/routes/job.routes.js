import express from "express";

import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
  getEmployerStats,
  getPublicStats,
  toggleJobStatus,

} from "../controllers/job.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

// =====================================================
// PUBLIC ROUTES
// =====================================================

// Ana sayfa istatistikleri
router.get("/stats", getPublicStats);

// Tüm ilanlar
router.get("/", getJobs);

// =====================================================
// PROTECTED EMPLOYER ROUTES
// =====================================================

// İşverenin kendi ilanları
// Frontend: GET /api/jobs/my-jobs
router.get(
  "/my-jobs",
  protect,
  authorize("employer"),
  getMyJobs
);

// İşveren dashboard istatistikleri
router.get(
  "/employer/stats",
  protect,
  authorize("employer"),
  getEmployerStats
);

// Yeni ilan oluştur
router.post(
  "/",
  protect,
  authorize("employer"),
  createJob
);

// =====================================================
// JOB ID ROUTES
// =====================================================

// Tek ilan
router.get(
  "/:id",
  getJobById
);
router.patch(
  "/:id/status",
  protect,
  authorize("employer"),
  toggleJobStatus
);

// İlan güncelle
router.put(
  "/:id",
  protect,
  authorize("employer"),
  updateJob
);

// İlan sil
router.delete(
  "/:id",
  protect,
  authorize("employer"),
  deleteJob
);

export default router;