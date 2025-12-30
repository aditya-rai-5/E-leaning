import express from "express";
import authRoutes from "./routes/auth.routes.js";
import createcourseRoutes from "./routes/course.routes.js";
import sectionRoutes from "./routes/section.routes.js";
import lessonRoutes from "./routes/lesson.routes.js";
import courseRoutes from "./routes/otuline.routes.js"
const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/create-course", createcourseRoutes);
app.use("/api", sectionRoutes);
app.use("/api", lessonRoutes);
app.use("/api", courseRoutes);

export default app;
