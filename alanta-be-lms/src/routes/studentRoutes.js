import express from "express";
import multer from "multer";
import { fileFilter, fileStorage } from "../utils/multer.js";
import { getStudents, postStudents, updateStudents } from "../controllers/studentController.js";
import {verifyToken} from '../middlewares/verifyToken.js'
const studentRoutes = express.Router()

const upload = multer({
    storage: fileStorage('students'),
    fileFilter
 });

studentRoutes.get('/students', verifyToken, getStudents)
studentRoutes.post('/students', verifyToken, upload.single('photo'), postStudents)
studentRoutes.put('/students/:id',verifyToken, upload.single('photo'), updateStudents)

export default studentRoutes