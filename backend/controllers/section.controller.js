import Course from "../models/course.model.js";
import Section from "../models/section.model.js";

export const createSection = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title } = req.body;

        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Section title is required and must be a valid string",
            })
        }

        if (!courseId || typeof courseId !== 'string') {
            return res.status(400).json({
                success: false,
                message: "Valid course ID is required",
            })
        }

        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated properly",
            })
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        if (course.instructorId.toString() != req.user._id.toString()
        ) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Not authorized",
                }
            )
        }


        const lastSection = await Section.findOne({ courseId })
            .sort({ order: -1 });

        const order = lastSection ? lastSection.order + 1 : 1;

        const section = await Section.create({
            title,
            courseId,
            order
        });

        return res.status(201).json({
            success: true,
            data: section
        });

    } catch (err) {
        console.error("Section creation error:", err);
        return res.status(500).json({
            success: false,
            message: "Section creation failed",
            error: err.message
        });
    }
};

// export default createSection;