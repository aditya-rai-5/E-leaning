import Course from "../models/course.model.js";
import slugify from "slugify";

export const createCourse = async (req, res, next) => {
    try {
        const { title, description, category, level, price } = req.body;
        if (!title || !description || !category || !level) {
            return res.status(400).json({
                success: false,
                message: "all field are required!!!",
            });
        }
        const slug = slugify(
            title, {
            lower: true,
            strict: true,
        }
        ) + "-" + Date.now();

        const course = await Course.create({
            title,
            slug,
            description,
            category,
            level,
            price,
            instructorId: req.user._id,
            isPublished: false,
        });

        return res.status(201).json({
            success: true,
            message: `${title} is created succesfully at ${Date.now()}`,
            data: course,
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "course creation failed",
            error: err.message,
        })
    }
}