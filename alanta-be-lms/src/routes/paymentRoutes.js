import express from "express";
import { handlePayment } from "../controllers/paymentController.js";

const paymentsRoutes = express.Router();

paymentsRoutes.post("/handle-payment-midtrans", handlePayment);

export default paymentsRoutes;
