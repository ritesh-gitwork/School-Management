import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";

import Attendence from "./models/attendence.model.js";
import Class from "./models/class.model.js";
import User from "./models/user.model.js";

let isClassLive = false;
let liveClassTeacherId = null;
const presentStudents = new Set(); // studentId strings

let wss;

export const initWebsocket = (server) => {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const token = url.searchParams.get("token");

      if (!token) {
        ws.close(1008, "Unauthorized");
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      ws.user = decoded; // { id, role }

      console.log("WS connected:", ws.user);

      ws.on("message", async (message) => {
        try {
          const data = JSON.parse(message.toString());

          if (!data.type) {
            ws.send(
              JSON.stringify({
                success: false,
                error: "Invalid message format",
              }),
            );
            return;
          }

          // start class teacher only
          if (data.type === "START_CLASS") {
            if (ws.user.role !== "teacher") {
              ws.send(
                JSON.stringify({
                  success: false,
                  error: "Forbidden, teacher access required",
                }),
              );
              return;
            }

            isClassLive = true;
            liveClassTeacherId = ws.user.id;

            // console.log(" Class started by:", ws.user.id);

            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    type: "CLASS_STARTED",
                    teacherId: ws.user.id,
                  }),
                );
              }
            });

            return;
          }

          //  stop class teacher only and save attendence
          
          // ================= STOP CLASS =================
          if (data.type === "STOP_CLASS") {
            // ✅ 1. AUTH CHECK FIRST
            if (
              ws.user.role !== "teacher" ||
              ws.user.id !== liveClassTeacherId
            ) {
              ws.send(
                JSON.stringify({
                  success: false,
                  error: "Forbidden, not the same teacher",
                }),
              );
              return;
            }

            // ✅ 2. FETCH CLASS
            const classData = await Class.findOne({
              teacherId: ws.user.id,
            }).populate("studentsIds");

            if (!classData) {
              ws.send(
                JSON.stringify({
                  success: false,
                  error: "Class not found",
                }),
              );
              return;
            }

            // ✅ 3. PREPARE ATTENDANCE
            const attendanceRecords = classData.studentsIds.map((student) => ({
              classId: classData._id,
              studentId: student._id,
              status: presentStudents.has(student._id.toString())
                ? "present"
                : "absent",
            }));

            // ✅ 4. SAVE ONCE
            await Attendence.insertMany(attendanceRecords);

            console.log("Attendance saved to DB");

            // ✅ 5. RESET STATE
            isClassLive = false;
            liveClassTeacherId = null;
            presentStudents.clear();

            // ✅ 6. BROADCAST STOP
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    type: "CLASS_STOPPED",
                  }),
                );
              }
            });

            return;
          }

          //  mark present (student only)
          if (data.type === "MARK_PRESENT") {
            if (!isClassLive) {
              ws.send(
                JSON.stringify({
                  success: false,
                  error: "Class is not live",
                }),
              );
              return;
            }

            if (ws.user.role !== "student") {
              ws.send(
                JSON.stringify({
                  success: false,
                  error: "Only students can mark attendance",
                }),
              );
              return;
            }

            // mark present
            presentStudents.add(ws.user.id);

            // ack to student
            ws.send(
              JSON.stringify({
                success: true,
                type: "PRESENT_MARKED",
              }),
            );

            // fetch student name and email
            const student = await User.findById(ws.user.id).select(
              "name email",
            );

            // notify teacher(s)
            wss.clients.forEach((client) => {
              if (
                client.readyState === WebSocket.OPEN &&
                client.user?.role === "teacher"
              ) {
                client.send(
                  JSON.stringify({
                    type: "STUDENT_PRESENT",
                    student: {
                      id: student.id,
                      name: student.name,
                      email: student.email,
                    },
                  }),
                );
              }
            });

            return;
          }

          // unknown type
          ws.send(
            JSON.stringify({
              success: false,
              error: "Invalid message format",
            }),
          );
        } catch (err) {
          ws.send(
            JSON.stringify({
              success: false,
              error: "Invalid message format",
            }),
          );
        }
      });

      ws.on("close", () => {
        console.log("WS disconnected:", ws.user?.id);
      });
    } catch (error) {
      ws.close(1008, "Invalid token");
    }
  });
};

export const getWSS = () => wss;
