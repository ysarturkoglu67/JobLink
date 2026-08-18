import express from "express";
import { protect } from "../middleware/auth.middleware.js";

import {
  sendMessage,
  getMessages,
  getConversations,
  markMessagesAsRead,
  getUnreadMessageCount,
} from "../controllers/message.controller.js";

const router = express.Router();

// =====================================================
// KONUŞMALAR
// GET /messages/conversations
// =====================================================

router.get(
  "/conversations",
  protect,
  getConversations
);
router.get(
  "/unread-count",
  protect,
  getUnreadMessageCount
);
router.put(
  "/:userId/read",
  protect,
  markMessagesAsRead
);
// =====================================================
// İKİ KULLANICI ARASINDAKİ MESAJLAR
// GET /messages/:userId
// =====================================================

router.get(
  "/:userId",
  protect,
  getMessages
);

// =====================================================
// MESAJ GÖNDER
// POST /messages
// =====================================================

router.post(
  "/",
  protect,
  sendMessage
);

export default router;