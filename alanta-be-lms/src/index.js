import express from "express";

import dotenv from "dotenv";
import cors from "cors";
import globalRoutes from "./routes/globalRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./utils/database.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";

const app = express();

dotenv.config();

connectDB();

const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173", // asal frontend Vite kamu
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options(/.*/, cors());

app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads")); 

app.get("/", (req, res) => {
  res.json({ text: "Hello World" });
});

app.use("/api", globalRoutes);
app.use("/api", paymentRoutes);
app.use("/api", authRoutes);
app.use("/api", courseRoutes);

app.listen(port, () => {
  console.log("Express App listening on port 3000");
});
