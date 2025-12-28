import e from "express";
import {createSection} from "../controllers/section.controller.js";
import { protect, isAuth, isInstructor } from "../middlewares/auth.middleware.js";

const router=e.Router();

router.post(
    "/courses/:courseId/sections",
    protect,
    isAuth,
    isInstructor,
    createSection
);

export default router;