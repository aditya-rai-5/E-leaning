import express from "express";
import authRoutes from "./routes/auth.routes.js";
import createcourseRoutes from "./routes/course.routes.js";
import sectionRoutes from "./routes/section.routes.js";
import lessonRoutes from "./routes/lesson.routes.js";
import courseRoutes from "./routes/outline.routes.js";
// import publishRoutes from "./routes/course.routes.js";
import attachmentRoutes from "./routes/attachment.routes.js";
import enrollRoutes from "./routes/enrollment.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import reviewRoutes from "./routes/review.routes.js";
const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", createcourseRoutes);
app.use("/api", sectionRoutes);
app.use("/api", lessonRoutes);
app.use("/api", courseRoutes);     // Mount outline at /api/courses
app.use("/api", reviewRoutes);
app.use("/api", attachmentRoutes);
app.use("/api/", enrollRoutes);
app.use("/api", progressRoutes);

export default app;
