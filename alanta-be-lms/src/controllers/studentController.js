import userModel from "../models/userModel";
import bcrypt from "bcrypt";
import { mutateStudentSchema } from "../utils/schema";
import courseModel from "../models/courseModel";

export const getStudents = async (req, res) => {
  try {
    const students = await userModel.find({
        role:  'student',
        manager: req.user._id
    }).select('name courses  photo')

    const response = students.map((item) => {
        return {
            ...item.toObject(),
            photo_url: photoUrl + item.photo
        }
    })
    return res.json({
        message: 'Get students successfully',
        data: students
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
        message: 'Internal server error'
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
              return res.status(500).json({
                message: "Error Validation",
                data: null,
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
            role: 'student'
        })
        await student.save();

        return res.json({
            message: "Student created successfully",
            data: student,
        })
    }
    catch (error) {
         console.log(error)
    return res.status(500).json({
        message: 'Internal server error'
    });
    }
}

export const updateStudents = async (req, res) => {
    try {
        const {id} = req.params;
         const body = req.body;
        
            const parse = mutateStudentSchema.partial({
                password: true
            }).safeParse(body);
        
            if (!parse.success) {
              const errorMessages = parse.error.issues.map((err) => err.message);
        
              if (req?.file?.path && fs.existsSync(req?.file?.path)) {
                fs.unlinkSync(req?.file?.path);
              }
              return res.status(500).json({
                message: "Error Validation",
                data: null,
                errors: errorMessages,
              });
            }
        const student = await userModel.findById(id);
        const hashPassword = parse.data.password ? bcrypt.hashSync(parse.data.password, 12) : student.password;
        await userModel.findByIdAndUpdate(id, {
            name: parse.data.name,
            email: parse.data.email,
            password: hashPassword,
            photo: req?.file? req.file?.filename : student.photo,
        })
        
        await student.save();

        return res.json({
            message: "Student update successfully",
            data: student,
        })
    }
    catch (error) {
         console.log(error)
    return res.status(500).json({
        message: 'Internal server error'
    });
    }
}

