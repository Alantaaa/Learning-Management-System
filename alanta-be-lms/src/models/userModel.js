import mongoose from "mongoose";
import { email } from "zod";
import { required } from "zod/mini";

const userModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["manager", "student"],
    default: "manager",
  },
    courses:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      }
    ],
    manager:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
});

export default mongoose.model("User", userModel);
