import e from "express";
import { enrollCourse } from "../controllers/enrollment.controller.js";
import { isAuth, protect } from "../middlewares/auth.middleware.js";

const router = e.Router();

router.post(
     "/courses/:courseId/enroll",
     protect,
     isAuth,
     enrollCourse
);

export default router;