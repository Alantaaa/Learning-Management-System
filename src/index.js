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

/* ==============================
   DATABASE
================================ */
connectDB();

/* ==============================
   CORS — WAJIB DI ATAS SEMUA ROUTE
================================ */
const ALLOWED_ORIGIN = "https://learning-management-system-alpha-ashen.vercel.app";

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  // ⛔ PENTING: HANDLE PREFLIGHT
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(
  cors({
    origin: ALLOWED_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

/* ==============================
   BODY PARSER
================================ */
app.use(express.json());

/* ==============================
   STATIC FILES
================================ */
app.use("/uploads", express.static("public/uploads"));

/* ==============================
   ROUTES
================================ */
app.get("/", (req, res) => {
  res.json({ message: "Backend LMS Online 🚀" });
});

app.use("/api", globalRoutes);
app.use("/api", paymentRoutes);
app.use("/api", authRoutes);
app.use("/api", courseRoutes);
app.use("/api", studentRoutes);
app.use("/api", overviewRoutes);

/* ==============================
   LOCAL ONLY
================================ */
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
  });
}

export default app;
