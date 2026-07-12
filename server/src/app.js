import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

export default app;