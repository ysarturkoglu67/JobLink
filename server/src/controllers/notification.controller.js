import Notification from "../models/notification.model.js";

// Bildirimleri getir
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      receiver: req.user._id,
    })
      .populate("sender", "name avatar")
      .sort("-createdAt");

    res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("GET NOTIFICATIONS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Okunmamış bildirim sayısı
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      receiver: req.user._id,
      read: false,
    });

    res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("GET UNREAD COUNT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Bildirimi okundu yap
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        receiver: req.user._id,
      },
      {
        read: true,
      },
      {
        new: true,
      }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Bildirim bulunamadı.",
      });
    }

    res.json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error("MARK AS READ ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Tüm bildirimleri okundu yap
export const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        receiver: req.user._id,
        read: false,
      },
      {
        read: true,
      }
    );

    res.json({
      success: true,
      message: "Tüm bildirimler okundu.",
    });
  } catch (error) {
    console.error("MARK ALL READ ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};