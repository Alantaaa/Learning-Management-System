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

const PORT = process.env.PORT || 3000;

// ✅ CORS - Allow ALL Vercel deployments untuk testing
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, curl, etc)
      if (!origin) return callback(null, true);
      
      // Allow localhost
      if (origin.includes('localhost')) return callback(null, true);
      
      // Allow any Vercel domain
      if (origin.includes('vercel.app')) return callback(null, true);
      
      callback(new Error('Not allowed by CORS'));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ✅ Tambah OPTIONS!
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// Static folders
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Default route
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

// Start server
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
  });
}

export default app;