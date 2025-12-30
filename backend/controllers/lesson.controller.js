import mongoose from "mongoose";
import Lesson from "../models/lesson.model.js";
import Section from "../models/section.model.js"
import Course from "../models/course.model.js";

export const createLesson = async (req, res) => {
    try {
        const { sectionId } = req.params;
        const { title, type, content, duration, attachments } = req.body;

        console.log("Lesson creation request received:");
        console.log("- sectionId:", sectionId);
        console.log("- user authenticated:", !!req.user);
        console.log("- user ID:", req.user?._id);

        // Validate input parameters
        if (!sectionId || typeof sectionId !== 'string') {
            return res.status(400).json({
                success: false,
                message: "Valid section ID is required",
            })
        }

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(sectionId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid section ID format",
            })
        }

        // Validate required fields
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Title is required and must be a valid string",
            })
        }

        if (!type || typeof type !== 'string' || type.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Type is required and must be a valid string",
            })
        }

        if (!content || typeof content !== 'string' || content.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Content is required and must be a valid string",
            })
        }

        // Convert sectionId to ObjectId for proper querying
        const sectionObjectId = new mongoose.Types.ObjectId(sectionId);

        const section = await Section.findById(sectionObjectId);
        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Section not found"
            });
        }

        console.log("Section found:", section.title);

        const course = await Course.findById(section.courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        console.log("Course found:", course.title);
        console.log("Course instructor:", course.instructorId.toString());
        console.log("Request user:", req.user._id.toString());

        if (course.instructorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized - you can only create lessons for your own courses"
            });
        }

        if (course.isPublished) {
            return res.status(400).json({
                success: false,
                message: "Cannot modify published course"
            });
        }

        // Check for duplicate lesson title in the same section
        const existingLesson = await Lesson.findOne({ 
            sectionId: sectionObjectId,
            title: title.trim()
        });
        
        if (existingLesson) {
            return res.status(400).json({
                success: false,
                message: "A lesson with this title already exists in this section",
            })
        }

        const lastLesson = await Lesson.findOne({ sectionId: sectionObjectId }).sort({ order: -1 });
        const order = lastLesson ? lastLesson.order + 1 : 1;

        console.log("Creating lesson with order:", order);

        const lesson = await Lesson.create({
            title: title.trim(),
            type: type.trim(),
            content: content.trim(),
            duration: duration || null,
            attachments: Array.isArray(attachments) ? attachments : [],
            sectionId: sectionObjectId,
            courseId: course._id,
            order
        });

        // Populate section and course info in response
        await lesson.populate([
            { path: 'sectionId', select: 'title' },
            { path: 'courseId', select: 'title' }
        ]);

        console.log("Lesson created successfully:", lesson._id);

        return res.status(201).json({
            success: true,
            data: lesson,
            message: "Lesson created successfully"
        });

    } catch (err) {
        console.error("Lesson creation error:", err);
        
        // Handle specific error types
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: err.errors
            });
        }
        
        if (err.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format",
                error: err.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Lesson creation failed",
            error: err.message
        });
    }
};