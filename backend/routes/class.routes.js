import express from "express";
import { addStudentClass, createClass, getClass, getClassById } from "../controller/class.controller.js";
import { verifyMiddleware } from "../middlewares/auth.middleware.js";
import { teacherOnly } from "../middlewares/role.middleware.js";
import { classSchema } from "../validators/class.schema.js";
import { validate } from "../middlewares/validate.middleware.js";
import { addStudentSchema } from "../validators/addStudent.schema.js";

const router = express.Router();

router.post("/create-class", verifyMiddleware, teacherOnly,validate(classSchema), createClass);
router.get("/getClass",verifyMiddleware,getClass);
router.post("/add-student",verifyMiddleware,teacherOnly,validate(addStudentSchema),addStudentClass)
router.get("/:id", verifyMiddleware, teacherOnly, getClassById);

export default router;
