import express from "express";
import { getStudents, postStudents } from "../controllers/studentController";
import multer from "multer";
import { fileFilter, fileStorageUser } from "../utils/multer.js";

const studentRoutes = express.Router();

const upload = multer({
    storage: fileStorageUser('students'),
    fileFilter
})

studentRoutes.get("/students". verifToken, getStudents)
studentRoutes.post("/students", verifToken, upload.single('avatar'), postStudents)
studentRoutes.put("/students/:id", verifToken, upload.single('avatar'), updateStudents)
export default studentRoutes;