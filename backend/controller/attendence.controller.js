import Attendance from "../models/attendence.model.js";
import Class from "../models/class.model.js";

export const markAttendance = async (req, res) => {
  try {
    const { classId, studentId, status } = req.body;

    // 1. class check
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({
        success: false,
        error: "Class not found",
      });
    }

    // 2. ownership check
    if (classData.teacherId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Forbidden, not class teacher",
      });
    }

    // 3. student belongs to class?
    const isStudentInClass = classData.studentsIds.some(
      (id) => id.toString() === studentId
    );

    if (!isStudentInClass) {
      return res.status(400).json({
        success: false,
        error: "Student not in this class",
      });
    }

    // 4️. save attendance
    const attendance = await Attendance.create({
      classId,
      studentId,
      status,
    });

    return res.status(201).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error("Attendance error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to mark attendance",
    });
  }
};

export const getAttendenceByClass = async(req,res)=>{

    try {
        const {classId} = req.params;
        const{id,role} = req.user;

        // 1. Class check
        const classData = await Class.findById(classId)

        if(!classData){
            return res.status(404).json({
                status:false,
                error:"class not found"
            })
        }

        // 2. role based access

        if(role=== "teacher"){
            if(classData.teacherId.toString() !==id){
                return res.status(403).json({
                success: false,
                error: "Forbidden, not class teacher",
                });
            }
        }

        let attendance;

        if(role=== "teacher"){
          attendance =await Attendance.find({classId}).populate("studentId","name,email")
        }
        else{
          attendance = await Attendance.find({
            classId,
            studentId:id,
          })
        }

        return res.status(200).json({
        success: true,
        data: attendance,
        });


    } catch (error) {
      console.error("Get attendance error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch attendance",
    });
  
        
    }
    

}

export const getAttendanceHistory = async (req, res) => {
  const { classId } = req.params;

  const records = await Attendance.find({ classId })
    .populate("studentId", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: records,
  });
};


export const getMyAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;

    const records = await Attendance.find({
      studentId,
    }).populate("classId", "className");

    const attendanceMap = {};

    records.forEach((record) => {
      const classId = record.classId._id.toString();
      const className = record.classId.className;

      if (!attendanceMap[classId]) {
        attendanceMap[classId] = {
          className,
          total: 0,
          present: 0,
        };
      }

      attendanceMap[classId].total++;

      if (record.status === "present") {
        attendanceMap[classId].present++;
      }
    });

    const result = Object.values(attendanceMap).map((cls) => {
      const percentage =
        cls.total === 0
          ? 0
          : ((cls.present / cls.total) * 100).toFixed(1);

      return {
        
        className: cls.className,
        percentage,
      };
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Attendance % error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to calculate attendance",
    });
  }
};

