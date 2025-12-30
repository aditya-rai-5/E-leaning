import express from "express";
import { getCourseOutline } from "../controllers/outline.controller.js";
import { protect, isAuth, isInstructor } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
     "/courses/:courseId/outline",
     protect,
     isAuth,
     isInstructor,
     getCourseOutline
);

export default router;
