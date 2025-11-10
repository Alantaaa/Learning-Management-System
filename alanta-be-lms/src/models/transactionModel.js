import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",  // atau "userModel" sesuai nama collection kamu
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "",
  },
}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);
