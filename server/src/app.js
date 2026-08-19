import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import savedJobRoutes from "./routes/savedJob.routes.js";
import employerRoutes from "./routes/employer.routes.js";
import messageRoutes from "./routes/message.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import interviewRoutes from "./routes/interview.routes.js";

const app = express();

// ==========================================
// Middleware
// ==========================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// ==========================================
// Static Folder
// ==========================================

app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "uploads")
  )
);

// ==========================================
// Ana Sayfa
// ==========================================

app.get("/", (req, res) => {
  res.send("🚀 Kariyerİnşa.com Backend API");
});

// ==========================================
// Health Check
// ==========================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Kariyerİnşa.com API çalışıyor 🚀",
  });
});

// ==========================================
// Routes
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/jobs", jobRoutes);

app.use(
  "/api/applications",
  applicationRoutes
);

app.use(
  "/api/saved-jobs",
  savedJobRoutes
);

app.use(
  "/api/employer",
  employerRoutes
);

app.use(
  "/api/messages",
  messageRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/interviews",
  interviewRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

// ==========================================
// 404
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint bulunamadı.",
  });
});

export default app;