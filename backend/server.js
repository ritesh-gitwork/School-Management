import express from "express";
import dotenv from "dotenv";
import http from "http"
import cors from "cors";




import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import classRoutes from "./routes/class.routes.js";
import joinReqRoutes from "./routes/joinRequest.routes.js"
import attendenceRoutes from "./routes/attendence.routes.js"
import { initWebsocket } from "./websocket.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;

const allowedOrigins = [
  "http://localhost:5173",
  "https://school-management-alpha-khaki.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));



app.use(express.json());

connectDB();

app.use("/auth", userRoutes);
app.use("/class", classRoutes);
app.use("/attendance",attendenceRoutes);
app.use("/user", userRoutes);
app.use("/joinReq",joinReqRoutes)


app.get("/", (req, res) => {
  res.status(200).json({ message: "hellooo" });

});


const server = http.createServer(app)


initWebsocket(server)

server.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});

