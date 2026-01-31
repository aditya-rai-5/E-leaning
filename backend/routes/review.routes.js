import express from "express";
import { addOrUpdateReview } from "../controllers/review.controller.js";
import { isAuth, protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
     "/courses/:courseId/reviews",
     isAuth,
     protect,
     addOrUpdateReview
);

export default router;
