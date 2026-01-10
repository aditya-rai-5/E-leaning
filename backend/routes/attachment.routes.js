import e from "express";
import { addAttachment } from "../controllers/attachment.controller.js";
import { isAuth, isInstructor, protect } from "../middlewares/auth.middleware.js";

const router = e.Router();
router.post(
     "/lessons/:lessonId/attachments",
     protect,
     isAuth,
     isInstructor,
     addAttachment
);

export default router;