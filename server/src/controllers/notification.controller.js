import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      receiver: req.user._id,
    })
      .populate("sender", "name avatar")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Bildirimler alınamadı.",
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      isRead: true,
    });

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Hata oluştu.",
    });
  }
};