import mongoose from "mongoose";
import Course from "../models/course.model.js";
import Section from "../models/section.model.js";
import Lesson from "../models/lesson.model.js";
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

export const publishCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Validate courseId is provided
        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required"
            });
        }

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID format"
            });
        }

        const courseObjectId = new mongoose.Types.ObjectId(courseId);
        console.log("[Publish API] CourseObjectId:", courseObjectId);

        const course = await Course.findById(courseObjectId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        if (course.instructorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }

        if (req.user.role === "instructor" && !req.user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Instructor must be verified to publish"
            });
        }

        if (course.isPublished) {
            return res.status(400).json({
                success: false,
                message: "Course already published"
            });
        }

        // const sections = await Section.find({
        //     courseId: course._id
        // }).lean();
        // const sections = await Section.find({});
        // console.log(sections[0].courseId, typeof sections[0].courseId);

        console.log("[Publish API] Querying sections...");

        // Query with BOTH ObjectId and string to handle legacy data
        const sections = await Section.find({
            $or: [
                { courseId: courseObjectId },
                { courseId: courseId }
            ]
        })
            .sort({ order: 1 })
            .lean();
        console.log("[Publish API] Sections found:", sections.length);

        // If not found, try to match using toString comparison (handles legacy data)
        if (sections.length === 0) {
            const allSections = await Section.find({}).lean();
            const matchingSections = allSections.filter(s => 
                String(s.courseId) === courseId
            );
            console.log("[Publish API] Sections found by toString:", matchingSections.length);
            
            if (matchingSections.length > 0) {
                sections.push(...matchingSections);
            }
        }

        if (sections.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Course must have at least one section"
            });
        }

        for (const section of sections) {
            const lessonCount = await Lesson.countDocuments({
                sectionId: section._id
            });

            if (lessonCount === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Each section must have at least one lesson"
                });
            }
        }

        course.isPublished = true;
        course.publishedAt = new Date();
        await course.save();

        return res.status(200).json({
            success: true,
            message: "Course published successfully"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to publish course",
            error: err.message
        });
    }
};
