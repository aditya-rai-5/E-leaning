import mongoose from "mongoose";
import Course from "../models/course.model.js";
import Section from "../models/section.model.js";
import Lesson from "../models/lesson.model.js";
import slugify from "slugify";
import enrollmentModel from "../models/enrollment.model.js";

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


export const getStudentOutline = async (req, res) => {
    try {
        const user = req.user;
        const { courseId } = req.params;

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "you are not verified yet"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                message: "invalid course id"
            });
        }

        const courseObjectId = new mongoose.Types.ObjectId(courseId);

        const course = await Course.findById(courseObjectId).select(
            "_id title description isPublished"
        );

        if (!course || !course.isPublished) {
            return res.status(404).json({
                success: false,
                message: "course not found"
            });
        }

        const enrolled = await enrollmentModel.findOne({
            userId: user._id,
            courseId: courseObjectId
        });

        if (!enrolled) {
            return res.status(403).json({
                success: false,
                message: "you are not enrolled in this course"
            });
        }

        // const sections = await Section.find({ courseId: courseObjectId })
        //     .sort({ order: 1 })
        //     .lean();

        // const lessons = await Lesson.find({ courseId: courseObjectId })
        //     .sort({ order: 1 })
        //     .lean();

        const sections = await Section.find({ courseId: courseObjectId })
            .sort({ order: 1 })
            .lean();

        // 4. Fetch lessons
        const lessons = await Lesson.find({ courseId: courseObjectId })
            .sort({ order: 1 })
            .lean();

        // 5. Group lessons by sectionId
        const lessonMap = {};
        for (const lesson of lessons) {
            const sid = lesson.sectionId.toString();
            if (!lessonMap[sid]) lessonMap[sid] = [];
            lessonMap[sid].push({
                _id: lesson._id,
                title: lesson.title,
                type: lesson.type,
                content: lesson.content,
                duration: lesson.duration,
                order: lesson.order,
                attachments: lesson.attachments
            });
        }

        // 6. Build sections structure
        let structuredSections = [];

        if (sections.length > 0) {
            // Normal case: sections exist, attach lessons to them
            structuredSections = sections.map(section => ({
                _id: section._id,
                title: section.title,
                order: section.order,
                lessons: lessonMap[section._id.toString()] || []
            }));
        } else if (lessons.length > 0) {
            // Edge case: no sections but lessons exist
            // Group lessons by their sectionId and create sections dynamically

            // Get unique sectionIds from lessons
            const uniqueSectionIds = [...new Set(lessons.map(l => l.sectionId.toString()))];

            // Create a section for each unique sectionId found in lessons
            structuredSections = uniqueSectionIds.map((sectionId, index) => ({
                _id: sectionId,
                title: `Section ${index + 1}`,
                order: index + 1,
                lessons: lessonMap[sectionId] || []
            }));
        }

        return res.status(200).json({
            success: true,
            data: {
                course: {
                    _id: course._id,
                    title: course.title,
                    description: course.description
                },
                sections: structuredSections
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "fail to fetch course outline api",
            error: err.message
        });
    }
};
