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
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/notifications", notificationRoutes);

// Ana sayfa
app.get("/", (req, res) => {
  res.send("🚀 JobLink Backend API");
});

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "JobLink API çalışıyor 🚀",
  });
});

// Routes
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/saved-jobs", savedJobRoutes);
app.use("/api/employer", employerRoutes);
app.use("/api/messages", messageRoutes);


export default app;