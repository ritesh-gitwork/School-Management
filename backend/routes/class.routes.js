import express from "express";
import { createClass } from "../controller/class.controller.js";
import { verifyMiddleware } from "../middlewares/auth.middleware.js";
import { teacherOnly } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/create-class", verifyMiddleware, teacherOnly, createClass);

export default router;
