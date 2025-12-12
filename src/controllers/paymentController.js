import mongoose from "mongoose";
import transactionModel from "../models/transactionModel.js";

export const handlePayment = async (req, res) => {
  try {
    console.log("Midtrans callback body:", req.body);

    const { order_id, transaction_status } = req.body;

    // validasi ObjectId dulu biar gak error cast
    if (!mongoose.Types.ObjectId.isValid(order_id)) {
      console.log("Invalid order_id:", order_id);
      return res.status(400).json({ message: "Invalid order_id" });
    }

    switch (transaction_status) {
      case "capture":
      case "settlement":
        await transactionModel.findByIdAndUpdate(order_id, {
          status: "success",
        });
        break;
      case "deny":
      case "cancel":
      case "expire":
      case "failure":
        await transactionModel.findByIdAndUpdate(order_id, {
          status: "failed",
        });
        break;
      default:
        break;
    }

    return res.status(200).json({
      message: "Handle Payment Success",
    });
  } catch (error) {
    console.error("HandlePayment Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
