import express from "express"
import { verifyMiddleware } from "../middlewares/auth.middleware.js";
import { getClassRequests, getMyRequests, handleRequest, requestToJoin } from "../controller/joinRequest.controller.js";
import { teacherOnly } from "../middlewares/role.middleware.js";

const router = express.Router()


//student
router.post("/join", verifyMiddleware, requestToJoin);
router.get("/my-requests", verifyMiddleware, getMyRequests);

// teacher
router.get("/requests/:classId", verifyMiddleware, teacherOnly, getClassRequests);
router.post("/handle-request", verifyMiddleware, teacherOnly, handleRequest);

export default router