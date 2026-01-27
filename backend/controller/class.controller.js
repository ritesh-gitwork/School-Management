import Class from "../models/class.model.js";
import User from "../models/user.model.js";

export const createClass = async (req, res) => {
  try {
    const { className } = req.body;

    const existingClass = await Class.findOne({ className });

    if (existingClass) {
      return res.status(400).json({
        status: false,
        message: "Class Already exists",
      });
    }

    const teacherId = req.user.id;

    const newClass = await Class.create({
      className,
      teacherId,
      studentsIds: [],
    });

    return res.status(201).json({
      success: true,
      data: newClass,
    });
  } catch (error) {
    console.error("create class error : ", error);

    return res.status(500).json({
      success: false,
      error: "Failed to create class",
    });
  }
};

export const getClass = async (req, res) => {
  try {

    const {id ,role} = req.user;

    let classes;

    if(role == "teacher"){
      classes = await Class.find({teacherId:id})
    }
    else{
      classes = await Class.find({studentsIds:id})
    }
    
    return res.status(200).json({
      success:true,
      data:classes
    })

    
  } catch (error) {
    return res.status(500).json({
      success:false,
      error:"failed to fetch classes"
    })
  }
};

export const addStudentClass = async (req, res) => {
  try {
    const { classId, studentId } = req.body;

    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({
        success: false,
        error: "Class not found",
      });
    }

    if (classData.teacherId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Forbidden, not class teacher",
      });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(400).json({
        success: false,
        error: "Invalid student",
      });
    }

    const alreadyAdded = classData.studentsIds.some(
      (id) => id.toString() === studentId
    );

    if (alreadyAdded) {
      return res.status(400).json({
        success: false,
        error: "Student already added",
      });
    }

    classData.studentsIds.push(studentId);
    await classData.save();

    return res.status(200).json({
      success: true,
      data: classData,
    });
  } catch (error) {
    console.error("Add student error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to add student",
    });
  }
};
