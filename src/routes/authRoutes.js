import express from "express";
import { validateRequest } from "../middlewares/validateRequest.js";
import { sigInSchema, signUpSchema } from "../utils/schema.js";
import { SignInAction, signUpAction } from "../controllers/authController.js";

const authRoutes = express.Router();

authRoutes.post("/sign-up", validateRequest(signUpSchema), signUpAction);
authRoutes.post("/sign-in", validateRequest(sigInSchema), SignInAction);

export default authRoutes;
