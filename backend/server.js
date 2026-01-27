import express from "express";
import dotenv from "dotenv";
import http from "http"

import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import classRoutes from "./routes/class.routes.js";
import attendenceRoutes from "./routes/attendence.routes.js"
import { initWebsocket } from "./websocket.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());

connectDB();

app.use("/auth", userRoutes);
app.use("/class", classRoutes);
app.use("/attendence",attendenceRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "hellooo" });

});


const server = http.createServer(app)


initWebsocket(server)

server.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});

