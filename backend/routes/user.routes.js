import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema } from "../validators/register.schema.js";
import { login, signup } from "../controller/auth.controller.js";
import { loginSchema } from "../validators/login.schema.js";
import { getAllStudents } from "../controller/class.controller.js";
import { verifyMiddleware } from "../middlewares/auth.middleware.js";
import { teacherOnly } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/signup", validate(registerSchema), signup);
router.post("/login", validate(loginSchema), login);
router.get("/students",verifyMiddleware,teacherOnly, getAllStudents);


export default router;
