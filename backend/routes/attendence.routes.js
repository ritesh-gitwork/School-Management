import express from "express";
import { verifyMiddleware } from "../middlewares/auth.middleware.js";
import { teacherOnly } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { attendanceSchema } from "../validators/attendence.schema.js";
import {
  getAttendanceHistory,
  getAttendenceByClass,
  getMyAttendance,
  getTeacherAttendanceOverview,
  markAttendance,
} from "../controller/attendence.controller.js";

const router = express.Router();

router.post(
  "/mark",
  verifyMiddleware,
  teacherOnly,
  validate(attendanceSchema),
  markAttendance,
);
// router.get("/class/:classId", verifyMiddleware, getAttendenceByClass);
router.get(
  "/class/:classId",
  verifyMiddleware,
  teacherOnly,
  getAttendanceHistory,
);

router.get(
  "/teacher-overview",
  verifyMiddleware,
  teacherOnly,
  getTeacherAttendanceOverview
);




router.get("/my", verifyMiddleware, getMyAttendance);

export default router;
