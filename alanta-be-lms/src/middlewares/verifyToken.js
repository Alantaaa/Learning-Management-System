import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const verifyToken = async (req, res, next) => {
  try {
    const secretKey = process.env.SECRET_KEY_JWT ?? "";

    // Cek header ada atau tidak
    const authHeader = req?.headers?.authorization;
    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const parts = authHeader.split(" ");
    const tokenType = parts[0]; // "JWT" atau "Bearer"
    const token = parts[1];

    // Cek token ada
    if (!token) {
      return res.status(401).json({
        message: "Token not found",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, secretKey);

    // Cek user di database
    const user = await userModel.findById(
      decoded.data?.id || decoded.id || decoded.userId,
      "_id name email role"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    // Handle JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token",
        error: error.message,
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired",
      });
    }

    // Generic error
    return res.status(500).json({
      message: "Authentication failed",
      error: error.message,
    });
  }
};
