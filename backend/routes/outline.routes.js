import express from "express";
import { getCourseOutline, getStudentOutline } from "../controllers/outline.controller.js";
import { protect, isAuth, isInstructor } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Instructor outline route (course owner only)
router.get(
     "/courses/:courseId/outline",
     protect,
     isAuth,
     isInstructor,
     getCourseOutline
);

// Student outline route (for enrolled students)
router.get(
     "/courses/:courseId/student-outline",
     protect,
     isAuth,
     getStudentOutline
);

export default router;

