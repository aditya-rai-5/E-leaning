import express from "express";
import authRoutes from "./routes/auth.routes.js";
import createcourseRoutes from "./routes/course.routes.js";
const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/create-course", createcourseRoutes);

export default app;
