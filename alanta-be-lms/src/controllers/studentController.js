import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import { mutateStudentSchema } from "../utils/schema.js";
import courseModel from "../models/courseModel.js";
import path from "path";
import fs from "fs";

// ✅ Get all students
export const getStudents = async (req, res) => {
  try {
    const students = await userModel
      .find({
        role: "student",
        manager: req.user._id,
      })
      .select("name courses photo email");

    // ✅ Definisikan photoUrl biar tidak ReferenceError
    const photoUrl = `${req.protocol}://${req.get("host")}/uploads/students/`;

    // Ubah struktur data agar photo_url bisa diakses langsung di frontend
    const response = students.map((item) => ({
      ...item.toObject(),
      photo_url: `${photoUrl}${item.photo}`,
    }));

    return res.json({
      message: "Get students successfully",
      data: response, // ✅ kirim response yang benar
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await userModel.findById(id).select("name email");

    return res.json({
      message: "Get Detail Student success ",
      data: student,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ✅ Create student
export const postStudents = async (req, res) => {
  try {
    const body = req.body;
    const parse = mutateStudentSchema.safeParse(body);

    if (!parse.success) {
      const errorMessages = parse.error.issues.map((err) => err.message);
      if (req?.file?.path && fs.existsSync(req?.file?.path)) {
        fs.unlinkSync(req?.file?.path);
      }
      return res.status(400).json({
        message: "Error Validation",
        errors: errorMessages,
      });
    }

    const hashPassword = bcrypt.hashSync(parse.data.password, 12);

    const student = new userModel({
      name: parse.data.name,
      email: parse.data.email,
      password: hashPassword,
      photo: req.file?.filename,
      manager: req.user._id,
      role: "student",
    });

    await student.save();

    return res.json({
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ✅ Update student
export const updateStudents = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const parse = mutateStudentSchema
      .partial({
        password: true,
      })
      .safeParse(body);

    if (!parse.success) {
      const errorMessages = parse.error.issues.map((err) => err.message);
      if (req?.file?.path && fs.existsSync(req?.file?.path)) {
        fs.unlinkSync(req?.file?.path);
      }
      return res.status(400).json({
        message: "Error Validation",
        errors: errorMessages,
      });
    }

    const student = await userModel.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // ✅ Ganti password jika dikirim
    const hashPassword = parse.data.password
      ? bcrypt.hashSync(parse.data.password, 12)
      : student.password;

    // ✅ Hapus file lama kalau ada upload baru
    if (req?.file?.filename && student.photo) {
      const oldPath = path.join(
        path.resolve(),
        "public/uploads/students",
        student.photo
      );
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // ✅ Update data student
    student.name = parse.data.name || student.name;
    student.email = parse.data.email || student.email;
    student.password = hashPassword;
    student.photo = req?.file?.filename || student.photo;

    await student.save();

    return res.json({
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ✅ Delete student
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await userModel.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // ✅ Hapus student dari courses yang mengandung dia
    await courseModel.findOneAndUpdate(
      { students: id },
      { $pull: { students: id } }
    );

    // ✅ Hapus foto student dari folder
    const filePath = path.join(
      path.resolve(),
      "public/uploads/students",
      student.photo
    );
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // ✅ Hapus student dari database
    await userModel.findByIdAndDelete(id);

    return res.json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
