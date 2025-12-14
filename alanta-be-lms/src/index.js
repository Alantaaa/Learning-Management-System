import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import globalRoutes from "./routes/globalRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./utils/database.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import overviewRoutes from "./routes/overviewRoutes.js";

dotenv.config();

const app = express();
connectDB();

// 🔥 CORS CONFIG YANG BENAR UNTUK VERCEL
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://learning-management-sy-git-13edf4-lintang-adya-alantas-projects.vercel.app",
    "https://learning-management-system-alpha-ashen.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],
  credentials: false,
};

// ✅ CORS HARUS DI ATAS SEMUA ROUTE
app.use(cors(corsOptions));

// 🔥 HANDLE PREFLIGHT REQUEST
app.options("*", cors(corsOptions));

// Body parser
app.use(express.json());

// Static
app.use(express.static("public"));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend LMS Online 🚀" });
});

// API Routes
app.use("/api", globalRoutes);
app.use("/api", paymentRoutes);
app.use("/api", authRoutes);
app.use("/api", courseRoutes);
app.use("/api", studentRoutes);
app.use("/api", overviewRoutes);

export default app;
