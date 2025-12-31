import express from "express"
import { createCourse, publishCourse } from "../controllers/course.controller.js"
import { protect, isAuth, isInstructor } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
    "/",
    protect,
    isInstructor,
    createCourse
);


router.post(
    "/:courseId/publish",
    protect,
    isInstructor,
    publishCourse
);

export default router;