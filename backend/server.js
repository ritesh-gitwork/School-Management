import express from "express";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());

connectDB();

app.use("/auth", userRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "hellooo" });
});

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
