import express from "express";
import multer from "multer";
import { fileFilter, fileStorage } from "../utils/multer.js";
import {
  deleteStudent,
  getCoursesStudents,
  getStudentById,
  getStudents,
  postStudents,
  updateStudents,
} from "../controllers/studentController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { get } from "mongoose";
const studentRoutes = express.Router();

const upload = multer({
  storage: fileStorage("students"),
  fileFilter,
});

studentRoutes.get("/students", verifyToken, getStudents);
studentRoutes.get("/students/:id", verifyToken, getStudentById);
studentRoutes.post(
  "/students",
  verifyToken,
  upload.single("photo"),
  postStudents
);
studentRoutes.put(
  "/students/:id",
  verifyToken,
  upload.single("photo"),
  updateStudents
);
studentRoutes.delete("/students/:id", verifyToken, deleteStudent);
studentRoutes.get('/students-courses', verifyToken, getCoursesStudents)

export default studentRoutes;
