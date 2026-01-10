import express from "express";
import { completeLesson, getCourseProgress } from "../controllers/progress.controller.js";
import { isAuth, protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/lessons/:lessonId/complete",
  protect,
  isAuth,
  completeLesson
);

router.get(
  "/courses/:courseId/progress",
  protect,
  isAuth,
  getCourseProgress
);

export default router;
