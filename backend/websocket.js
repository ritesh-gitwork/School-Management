import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";

import Attendence from "./models/attendence.model.js";
import Class from "./models/class.model.js";
import User from "./models/user.model.js";

// let isClassLive = false;
// let liveClassTeacherId = null;
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

      // ws.user = { id:"test", role:"teacher"}

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
              ws.send(JSON.stringify({ success: false, error: "Forbidden" }));
              return;
            }

            const { classId } = data;

            const classData = await Class.findById(classId);

            if (!classData) {
              ws.send(
                JSON.stringify({ success: false, error: "Class not found" }),
              );
              return;
            }

            if (classData.teacherId.toString() !== ws.user.id) {
              ws.send(
                JSON.stringify({ success: false, error: "Not class teacher" }),
              );
              return;
            }

            classData.isLive = true;
            await classData.save();

            console.log("Class started:", classId);

            // broadcast
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    type: "CLASS_STATUS",
                    classId,
                    isLive:true
                  }),
                );
              }
            });

            return;
          }

          //  stop class teacher only and save attendence

          // ================= STOP CLASS =================
          if (data.type === "STOP_CLASS") {
            if (ws.user.role !== "teacher") {
              ws.send(JSON.stringify({ success: false, error: "Forbidden" }));
              return;
            }

            const { classId } = data;

            const classData =
              await Class.findById(classId).populate("studentsIds");

            if (!classData) {
              ws.send(
                JSON.stringify({ success: false, error: "Class not found" }),
              );
              return;
            }

            if (classData.teacherId.toString() !== ws.user.id) {
              ws.send(
                JSON.stringify({ success: false, error: "Not class teacher" }),
              );
              return;
            }

            // save attendance
            const attendanceRecords = classData.studentsIds.map((student) => ({
              classId: classData._id,
              studentId: student._id,
              status: presentStudents.has(student._id.toString())
                ? "present"
                : "absent",
            }));

            await Attendence.insertMany(attendanceRecords);

            classData.isLive = false;
            await classData.save();

            presentStudents.clear();

            console.log("Class stopped:", classId);

            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    type: "CLASS_STATUS",
                    classId,
                    isLive:false
                  }),
                );
              }
            });

            return;
          }

          //  mark present (student only)
          if (data.type === "MARK_PRESENT") {
            const { classId } = data;

            const classData = await Class.findById(classId);

            if (!classData?.isLive) {
              ws.send(
                JSON.stringify({ success: false, error: "Class not live" }),
              );
              return;
            }

            if (ws.user.role !== "student") {
              ws.send(
                JSON.stringify({
                  success: false,
                  error: "Only students allowed",
                }),
              );
              return;
            }

            presentStudents.add(ws.user.id);

            ws.send(
              JSON.stringify({
                success: true,
                type: "PRESENT_MARKED",
              }),
            );

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
