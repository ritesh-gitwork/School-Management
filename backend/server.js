import express from "express";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import classRoutes from "./routes/class.routes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());

connectDB();

app.use("/auth", userRoutes);
app.use("/class", classRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "hellooo" });
});

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
