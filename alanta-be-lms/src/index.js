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

// PORT untuk Vercel atau local
const PORT = process.env.PORT || 3000;

// CORS untuk development + production
app.use(
  cors({
    origin: [
      "http://localhost:5173", // localhost FE
      "https://learning-management-system-alpha-ashen.vercel.app", // FE setelah deploy (ubah sesuai nama FE kamu)
    ],
    methods: ["GET", "POST", "PUT", "DELETE" "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


//app.options("/*", cors());

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

// Start server (Works on Vercel + Local)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
  });
}

export default app;
