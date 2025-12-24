import express from "express"
import { createCourse } from "../controllers/course.controller.js"
import { protect, isInstructor } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
    "/",
    protect,
    isInstructor,
    createCourse
);

export default router;
