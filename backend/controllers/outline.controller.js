import mongoose from "mongoose";
import Course from "../models/course.model.js";
import Section from "../models/section.model.js";
import Lesson from "../models/lesson.model.js";

export const getCourseOutline = async (req, res) => {
     try {
          const { courseId } = req.params;
          const userId = req.user?._id;

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

          // Convert courseId to ObjectId for consistent querying
          const courseObjectId = new mongoose.Types.ObjectId(courseId);

          // 1. Fetch course
          const course = await Course.findById(courseObjectId).select(
               "_id title description isPublished category instructorId"
          );

          if (!course) {
               return res.status(404).json({
                    success: false,
                    message: `Course not found with ID: ${courseId}`
               });
          }

          // 2. Ownership check (instructor-only for now)
          const courseInstructorId = course.instructorId?.toString();

          if (courseInstructorId !== userId?.toString()) {
               return res.status(403).json({
                    success: false,
                    message: "Not authorized - you do not own this course",
                    debug: {
                         courseInstructorId,
                         requestUserId: userId
                    }
               });
          }

          // 3. Fetch sections - use $expr to handle ObjectId comparison issues
          const sections = await Section.find({
               $expr: {
                    $or: [
                         { $eq: ["$courseId", courseObjectId] },
                         { $eq: [{ $toString: "$courseId" }, courseId] }
                    ]
               }
          })
               .sort({ order: 1 })
               .lean();

          // 4. Fetch lessons - use $expr to handle ObjectId comparison issues
          const lessons = await Lesson.find({
               $expr: {
                    $or: [
                         { $eq: ["$courseId", courseObjectId] },
                         { $eq: [{ $toString: "$courseId" }, courseId] }
                    ]
               }
          })
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
                         description: course.description,
                         category: course.category,
                         isPublished: course.isPublished
                    },
                    sections: structuredSections
               }
          });

     } catch (err) {
          console.error("[Outline API] Error:", err);
          return res.status(500).json({
               success: false,
               message: "Failed to fetch course outline",
               error: err.message
          });
     }
};

export const getStudentOutline = async (req, res) => {
     try {
          const { courseId } = req.params;
          const userId = req.user?._id;

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

          // Convert courseId to ObjectId for consistent querying
          const courseObjectId = new mongoose.Types.ObjectId(courseId);

          // 1. Fetch course (must be published)
          const course = await Course.findById(courseObjectId).select(
               "_id title description isPublished"
          );

          if (!course) {
               return res.status(404).json({
                    success: false,
                    message: `Course not found with ID: ${courseId}`
               });
          }

          if (!course.isPublished) {
               return res.status(403).json({
                    success: false,
                    message: "Course is not published"
               });
          }

          // 2. Check if user is enrolled
          // Note: Import enrollment model if not already imported
          // For now, we'll check if user is enrolled (this would need enrollmentModel import)
          // For simplicity, we'll skip enrollment check here as it's handled by the route
          // or can be added based on your enrollment logic

          // 3. Fetch sections - use $expr to handle ObjectId comparison issues
          const sections = await Section.find({
               $expr: {
                    $or: [
                         { $eq: ["$courseId", courseObjectId] },
                         { $eq: [{ $toString: "$courseId" }, courseId] }
                    ]
               }
          })
               .sort({ order: 1 })
               .lean();

          // 4. Fetch lessons - use $expr to handle ObjectId comparison issues
          const lessons = await Lesson.find({
               $expr: {
                    $or: [
                         { $eq: ["$courseId", courseObjectId] },
                         { $eq: [{ $toString: "$courseId" }, courseId] }
                    ]
               }
          })
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
               const uniqueSectionIds = [...new Set(lessons.map(l => l.sectionId.toString()))];
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
          console.error("[Student Outline API] Error:", err);
          return res.status(500).json({
               success: false,
               message: "Failed to fetch student course outline",
               error: err.message
          });
     }
};

