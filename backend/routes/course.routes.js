import express from "express"
import { createCourse, publishCourse, getStudentOutline } from "../controllers/course.controller.js"
import { protect, isAuth, isInstructor } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
    "/create-course",
    protect,
    isInstructor,
    createCourse
);


router.post(
    "/courses/:courseId/publish",
    protect,
    isInstructor,
    publishCourse
);

// router.get(
//     "/courses/:courseId/student-outline",
//     protect,
//     isAuth,
//     getStudentOutline,
// );

export default router;