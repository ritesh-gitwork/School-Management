import Attendence from "../models/attendence.model.js";
import Class from "../models/class.model.js";

// ================= MARK ATTENDANCE =================
export const markAttendance = async (req, res) => {
  try {
    const { classId, studentId, status } = req.body;

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
        error: "Forbidden",
      });
    }

    const isStudentInClass = classData.studentsIds.some(
      (id) => id.toString() === studentId,
    );

    if (!isStudentInClass) {
      return res.status(400).json({
        success: false,
        error: "Student not in this class",
      });
    }

    const attendance = await Attendence.create({
      classId,
      studentId,
      status,
    });

    return res.status(201).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error("Mark attendance error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to mark attendance",
    });
  }
};

// ================= GET CLASS ATTENDANCE (Detailed List) =================
export const getAttendenceByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { id, role } = req.user;

    const classData = await Class.findById(classId);

    if (!classData) {
      return res.status(404).json({
        success: false,
        error: "Class not found",
      });
    }

    if (role === "teacher") {
      if (classData.teacherId.toString() !== id) {
        return res.status(403).json({
          success: false,
          error: "Not your class",
        });
      }
    }

    let attendance;

    if (role === "teacher") {
      attendance = await Attendence.find({ classId })
        .populate("studentId", "name, email")
        .sort({ createdAt: -1 });
    } else {
      attendance = await Attendence.find({
        classId,
        studentId: id,
      }).sort({ createdAt: -1 });
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
};

// ================= SUBJECT-WISE HISTORY (Grouped By Date) =================
export const getAttendanceHistory = async (req, res) => {
  try {
    const { classId } = req.params;

    const records = await Attendence.find({ classId });

    const grouped = {};

    records.forEach((rec) => {
      // ✅ Safe date handling
      const rawDate = rec.createdAt || rec.date;

      if (!rawDate) return; // skip invalid record

      // const date = new Date(rawDate).toISOString().split("T")[0];
      const date = rec.date
        ? rec.date.toISOString().split("T")[0]
        : new Date(rec.createdAt).toISOString().split("T")[0];

      if (!grouped[date]) {
        grouped[date] = {
          date,
          totalStudents: 0,
          presentCount: 0,
          absentCount: 0,
        };
      }

      grouped[date].totalStudents++;

      if (rec.status === "present") {
        grouped[date].presentCount++;
      } else {
        grouped[date].absentCount++;
      }
    });

    return res.status(200).json({
      success: true,
      data: Object.values(grouped),
    });
  } catch (error) {
    console.error("History error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch history",
    });
  }
};

// ================= STUDENT PERSONAL ATTENDANCE % =================
export const getMyAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;

    const records = await Attendence.find({
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

    const result = Object.values(attendanceMap).map((cls) => ({
      className: cls.className,
      percentage:
        cls.total === 0 ? 0 : ((cls.present / cls.total) * 100).toFixed(1),
    }));

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Student % error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to calculate attendance",
    });
  }
};

// ================= TEACHER OVERVIEW =================
export const getTeacherAttendanceOverview = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const classes = await Class.find({ teacherId });

    const overview = [];

    for (const cls of classes) {
      const records = await Attendence.find({
        classId: cls._id,
      });

      const totalSessions = records.length;
      const presentCount = records.filter((r) => r.status === "present").length;

      const percentage =
        totalSessions === 0
          ? 0
          : ((presentCount / totalSessions) * 100).toFixed(1);

      overview.push({
        classId: cls._id,
        className: cls.className,
        totalSessions,
        percentage,
      });
    }

    return res.status(200).json({
      success: true,
      data: overview,
    });
  } catch (error) {
    console.error("Overview error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch overview",
    });
  }
};
