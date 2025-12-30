import express from "express";
import { createLesson } from "../controllers/lesson.controller.js";
import { protect, isAuth, isInstructor } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/sections/:sectionId/lessons",
  protect,
  isAuth,
  isInstructor,
  createLesson
);

export default router;