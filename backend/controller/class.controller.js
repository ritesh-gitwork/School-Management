import Class from "../models/class.model.js";

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
    const { className } = req.body;

    const seeClass = Class.find({ className });

    return res.status();
  } catch (error) {}
};
