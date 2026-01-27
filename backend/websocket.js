import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";

import Attendence from "./models/attendence.model.js"
import Class from "./models/class.model.js"

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
          if (data.type === "STOP_CLASS") {
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



            // fetch class 
            const classData = await Class.findOne({teacherId:ws.user.id})

            if(!classData){
                ws.send(JSON.stringify({
                    success:false,
                    error:"Class not found"
                }));
                return;
            }

            // prepare attendence
            const attendanceRecords =classData.studentsIds.map((studentId)=>({
                classId:classData._id,
                studentId,
                status:presentStudents.has(studentId.toString())?"present":"absent",
            }));

            await Attendence.insertMany(attendanceRecords);

            // reset state

            isClassLive = false;
            liveClassTeacherId = null;
            presentStudents.clear();

            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    type: "CLASS_STOPPED",
                  }),
                );
              }
            });

            console.log("attendence saved to DB");
            

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

            // notify teacher(s)
            wss.clients.forEach((client) => {
              if (
                client.readyState === WebSocket.OPEN &&
                client.user?.role === "teacher"
              ) {
                client.send(
                  JSON.stringify({
                    type: "STUDENT_PRESENT",
                    studentId: ws.user.id,
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
          ws.send(JSON.stringify({
            success: false,
            error: "Invalid message format",
          }));
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
