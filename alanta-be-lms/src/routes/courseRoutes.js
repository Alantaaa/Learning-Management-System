import express from "express";
import {
  deleteContentCourse,
  deleteCourse,
  getCategories,
  getCourses,
  getCoursesById,
  getDetailContent,
  postContentCourse,
  postCourse,
  updateContentCourse,
  updateCourse,
} from "../controllers/courseController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import multer from "multer";
import { fileStorageCourse, fileFilter } from "../utils/multer.js";
import { mutateContentSchema } from "../utils/schema.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const courseRoutes = express.Router();

const uploads = multer({
  storage: fileStorageCourse,
  fileFilter,
});

courseRoutes.get("/courses", verifyToken, getCourses);
courseRoutes.post(
  "/courses",
  verifyToken,
  uploads.single("thumbnail"),
  postCourse
);

courseRoutes.put(
  "/courses/:id",
  verifyToken,
  uploads.single("thumbnail"),
  updateCourse
);

courseRoutes.get("/categories", verifyToken, getCategories);
courseRoutes.get("/courses/:id", verifyToken, getCoursesById);

courseRoutes.delete("/courses/:id", verifyToken, deleteCourse);

courseRoutes.post(
  "/courses/contents",
  verifyToken,
  validateRequest(mutateContentSchema),
  postContentCourse
);
courseRoutes.put(
  "/courses/contents/:id",
  verifyToken,
  validateRequest(mutateContentSchema),
  updateContentCourse
);
courseRoutes.delete("/courses/contents/:id", verifyToken, deleteContentCourse);
courseRoutes.get("/courses/contents/:id", verifyToken, getDetailContent);
export default courseRoutes;
