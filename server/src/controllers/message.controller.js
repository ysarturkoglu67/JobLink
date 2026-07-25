import Message from "../models/Message.js";

// Mesaj gönder
export const sendMessage = async (req, res) => {
  try {
    const { receiver, message } = req.body;

    const newMessage = await Message.create({
      sender: req.user._id,
      receiver,
      message,
    });

    res.status(201).json({
      success: true,
      message: newMessage,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// İki kullanıcı arasındaki mesajlar
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        {
          sender: req.user._id,
          receiver: req.params.userId,
        },
        {
          sender: req.params.userId,
          receiver: req.user._id,
        },
      ],
    })
      .sort("createdAt")
      .populate("sender", "name")
      .populate("receiver", "name");

    res.status(200).json({
      success: true,
      messages,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};