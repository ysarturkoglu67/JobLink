import Message from "../models/Message.js";
import User from "../models/User.js";
import Notification from "../models/notification.model.js";
import { io } from "../server.js";

// =====================================================
// MESAJ GÖNDER
// =====================================================

export const sendMessage = async (req, res) => {
  try {
    const { receiver, message } = req.body;

    if (!receiver || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Alıcı ve mesaj gerekli.",
      });
    }

    // Kullanıcı kendisine mesaj gönderemesin
    if (receiver.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Kendinize mesaj gönderemezsiniz.",
      });
    }

    // Alıcı var mı?
    const receiverUser = await User.findById(receiver);

    if (!receiverUser) {
      return res.status(404).json({
        success: false,
        message: "Alıcı kullanıcı bulunamadı.",
      });
    }

    // Mesaj oluştur
    const newMessage = await Message.create({
      sender: req.user._id,
      receiver,
      message: message.trim(),
    });

    // Kullanıcı bilgilerini doldur
    const populatedMessage = await Message.findById(
      newMessage._id
    )
      .populate("sender", "name avatar")
      .populate("receiver", "name avatar");

    // Socket.IO ile anlık mesaj gönder
    io.to(receiver.toString()).emit(
      "new-message",
      populatedMessage
    );

    // Bildirim oluştur
    const notification = await Notification.create({
      receiver,
      sender: req.user._id,
      type: "message",
      text: `${req.user.name} size bir mesaj gönderdi.`,
    });

    // Anlık bildirim
    io.to(receiver.toString()).emit(
      "receive-notification",
      notification
    );

    return res.status(201).json({
      success: true,
      message: populatedMessage,
    });

  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// İKİ KULLANICI ARASINDAKİ MESAJLAR
// =====================================================

export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        {
          sender: req.user._id,
          receiver: userId,
        },
        {
          sender: userId,
          receiver: req.user._id,
        },
      ],
    })
      .populate("sender", "name avatar")
      .populate("receiver", "name avatar")
      .sort("createdAt");

    return res.json({
      success: true,
      messages,
    });

  } catch (error) {
    console.error("GET MESSAGES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// KONUŞMALAR
// =====================================================

export const getConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        {
          sender: req.user._id,
        },
        {
          receiver: req.user._id,
        },
      ],
    })
      .populate("sender", "name avatar")
      .populate("receiver", "name avatar")
      .sort("-createdAt");

    const map = new Map();

    for (const msg of messages) {
      const other =
        msg.sender._id.toString() ===
          req.user._id.toString()
          ? msg.receiver
          : msg.sender;

      const otherId = other._id.toString();

      if (!map.has(otherId)) {
        map.set(otherId, {
          user: other,
          lastMessage: msg.message,
          createdAt: msg.createdAt,
        });
      }
    }

    return res.json({
      success: true,
      chats: [...map.values()],
    });

  } catch (error) {
    console.error("GET CONVERSATIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =====================================================
// MESAJLARI OKUNDU YAP
// =====================================================

export const markMessagesAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    await Message.updateMany(
      {
        sender: userId,
        receiver: req.user._id,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    return res.json({
      success: true,
      message: "Mesajlar okundu olarak işaretlendi.",
    });
  } catch (error) {
    console.error("MARK MESSAGES READ ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =====================================================
// OKUNMAMIŞ MESAJ SAYISI
// =====================================================

export const getUnreadMessageCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      isRead: false,
    });

    return res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("UNREAD MESSAGE COUNT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};