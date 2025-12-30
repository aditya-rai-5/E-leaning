import e from "express";
import {createSection} from "../controllers/section.controller.js";
import { protect, isAuth, isInstructor, isVerifiedInstructor } from "../middlewares/auth.middleware.js";

const router=e.Router();

// Create a new section for a course
router.post(
    "/courses/:courseId/sections",
    protect,
    isAuth,
    isInstructor,
    createSection
);

// Alternative route for verified instructors only (if you want to enforce verification later)
// router.post(
//     "/verified-courses/:courseId/sections",
//     protect,
//     isAuth,
//     isVerifiedInstructor,
//     createSection
// );

export default router;
