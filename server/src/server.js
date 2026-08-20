import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import { connectDatabase } from "./config/database.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://kariyerinsa.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
});
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🟢 Kullanıcı bağlandı:", socket.id);

  // =====================================================
  // KULLANICI ONLINE
  // =====================================================

  socket.on("join", (userId) => {
    if (!userId) return;

    socket.join(userId);

    onlineUsers.set(userId.toString(), socket.id);

    io.emit(
      "online-users",
      [...onlineUsers.keys()]
    );

    console.log("👤 Kullanıcı online:", userId);
  });

  // =====================================================
  // BİLDİRİM
  // =====================================================

  socket.on("send-notification", (notification) => {
    if (!notification?.receiver) return;

    io.to(notification.receiver.toString()).emit(
      "receive-notification",
      notification
    );
  });

  // =====================================================
  // YAZIYOR
  // =====================================================

  socket.on(
    "typing",
    ({ sender, receiver }) => {
      if (!receiver) return;

      io.to(receiver.toString()).emit(
        "typing",
        sender
      );
    }
  );

  // =====================================================
  // YAZMAYI BIRAKTI
  // =====================================================

  socket.on(
    "stop-typing",
    ({ receiver }) => {
      if (!receiver) return;

      io.to(receiver.toString()).emit(
        "stop-typing"
      );
    }
  );

  // =====================================================
  // DISCONNECT
  // =====================================================

  socket.on("disconnect", () => {
    console.log(
      "🔴 Kullanıcı ayrıldı:",
      socket.id
    );

    for (
      const [userId, socketId]
      of onlineUsers.entries()
    ) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }

    io.emit(
      "online-users",
      [...onlineUsers.keys()]
    );
  });
});

// =====================================================
// SERVER BAŞLAT
// =====================================================

async function start() {
  try {
    await connectDatabase();

    server.listen(PORT, () => {
      console.log(
        `🚀 Server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "❌ Server başlatılamadı:",
      error
    );

    process.exit(1);
  }
}

start();