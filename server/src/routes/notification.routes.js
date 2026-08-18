import express from "express";
import { protect } from "../middleware/auth.middleware.js";

import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protect, getNotifications);

router.get(
  "/unread-count",
  protect,
  getUnreadCount
);

router.put(
  "/:id/read",
  protect,
  markAsRead
);

router.put(
  "/read-all",
  protect,
  markAllRead
);

export default router;