import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import { mutateStudentSchema } from "../utils/schema.js";
import courseModel from "../models/courseModel.js";
import path from "path";
import fs from "fs";

export const getStudents = async (req, res) => {
  try {
    const students = await userModel
      .find({
        role: "student",
        manager: req.user._id,
      })
      .select("name courses photo email");

    
    const photoUrl = `${req.protocol}://${req.get("host")}/uploads/students/`;

    
    const response = students.map((item) => ({
      ...item.toObject(),
      photo_url: `${photoUrl}${item.photo}`,
    }));

    return res.json({
      message: "Get students successfully",
      data: response, 
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

    
    const hashPassword = parse.data.password
      ? bcrypt.hashSync(parse.data.password, 12)
      : student.password;

   
    if (req?.file?.filename && student.photo) {
      const oldPath = path.join(
        path.resolve(),
        "public/uploads/students",
        student.photo
      );
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

  
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


export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await userModel.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    
    await courseModel.findOneAndUpdate(
      { students: id },
      { $pull: { students: id } }
    );

    
    const filePath = path.join(
      path.resolve(),
      "public/uploads/students",
      student.photo
    );
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

   
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

export const getCoursesStudents = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).populate({
      path: 'courses',
      select: 'name category thumbnail',
      populate: {
        path: 'category',
        select: 'name'
      }
    })

   const  imageUrl =
      process.env.APP_URL.replace("/api", "") + "/uploads/courses/"

    const response  = user?.courses?.map((item) => {
      return{
        ...item.toObject(),
        thumbnail_url: imageUrl + item.thumbnail
      }
    })
    return res.json({
      message: 'Get Course success',
      data: response
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}