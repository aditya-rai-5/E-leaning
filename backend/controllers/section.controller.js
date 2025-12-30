import mongoose from "mongoose";
import Course from "../models/course.model.js";
import Section from "../models/section.model.js";

export const createSection = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title } = req.body;

        // Validate input
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

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID format",
            })
        }

        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated properly",
            })
        }

        // Check if user is verified (if required)
        if (!req.user.isVerified && req.user.role === "Instructor") {
            return res.status(403).json({
                success: false,
                message: "Instructor account must be verified to create sections",
            })
        }

        // Convert courseId to ObjectId for proper querying
        const courseObjectId = new mongoose.Types.ObjectId(courseId);
        
        const course = await Course.findById(courseObjectId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // Check if user owns the course
        if (course.instructorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized - you can only create sections for your own courses",
            })
        }

        // Check for duplicate section title in the same course
        const existingSection = await Section.findOne({ 
            courseId: courseObjectId,
            title: title.trim()
        });
        
        if (existingSection) {
            return res.status(400).json({
                success: false,
                message: "A section with this title already exists in this course",
            })
        }

        // Get the next order number
        const lastSection = await Section.findOne({ courseId: courseObjectId })
            .sort({ order: -1 });

        const order = lastSection ? lastSection.order + 1 : 1;

        // Create the section
        const section = await Section.create({
            title: title.trim(),
            courseId: courseObjectId,
            order
        });

        // Populate course info in response
        await section.populate('courseId', 'title');

        return res.status(201).json({
            success: true,
            data: section,
            message: "Section created successfully"
        });

    } catch (err) {
        console.error("Section creation error:", err);
        
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
            message: "Section creation failed",
            error: err.message
        });
    }
};

// export default createSection;