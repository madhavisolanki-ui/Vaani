import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import { authMiddleware, AuthRequest } from "./middleware/auth";
import { createUser } from "./services/authService";
import translateRoutes from "./routes/translate";
import ttsRoutes from "./routes/tts";
import curriculumRoutes from "./routes/curriculum";
import worksheetRoutes from "./routes/worksheets";
import flashcardRoutes from "./routes/flashcards";
import liveClassRoutes from "./routes/liveClass";
import syncRoutes from "./routes/sync";
import quizRoutes from "./routes/quizzes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Vernacular Pedagogy Backend (Jharkhand SIH-26042)",
    timestamp: new Date().toISOString(),
  });
});

// Auth Routes
app.use("/api/auth", authRoutes);
app.get("/api/me", authMiddleware, (req, res) => {
  const authReq = req as AuthRequest;
  res.json(authReq.user);
});

// Core AI & Pedagogy Services
app.use("/api/curriculum", curriculumRoutes);
app.use("/api/worksheets", worksheetRoutes);
app.use("/api/flashcards", flashcardRoutes);
app.use("/api/live", liveClassRoutes);
app.use("/api/sync", syncRoutes);
app.use("/api/quizzes", quizRoutes);

// Legacy routes for backwards compatibility
app.use("/api/translate", translateRoutes);
app.use("/api/tts", ttsRoutes);

const PORT = process.env.PORT || 4000;

(async () => {
  await createUser("teacher@test.com", "123456", "teacher", "Madhavi", "san");
  await createUser("student@test.com", "123456", "student", "Student", "san", "Jharkhand District", undefined, undefined, undefined, "कक्षा 1");
  console.log("Seed users initialized: Madhavi (teacher@test.com) & student@test.com (कक्षा 1)");

  app.listen(PORT, () => {
    console.log(`🚀 Teacher Vernacular Education Backend running on http://localhost:${PORT}`);
  });
})();