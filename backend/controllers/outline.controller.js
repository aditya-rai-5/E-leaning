import mongoose from "mongoose";
import Course from "../models/course.model.js";
import Section from "../models/section.model.js";
import Lesson from "../models/lesson.model.js";

export const getCourseOutline = async (req, res) => {
     try {
          const { courseId } = req.params;
          const userId = req.user?._id;

          // Debug info (remove in production)
          console.log("[Outline API] CourseId:", courseId, "Type:", typeof courseId);
          console.log("[Outline API] UserId:", userId, "Type:", typeof userId);
          console.log("[Outline API] UserRole:", req.user?.role);

          // Convert courseId to ObjectId for consistent querying
          const courseObjectId = new mongoose.Types.ObjectId(courseId);
          console.log("[Outline API] CourseObjectId:", courseObjectId);

          // 1. Fetch course
          const course = await Course.findById(courseObjectId).select(
               "_id title description isPublished category instructorId"
          );

          if (!course) {
               console.log("[Outline API] Course not found");
               return res.status(404).json({
                    success: false,
                    message: `Course not found with ID: ${courseId}`
               });
          }

          console.log("[Outline API] Course found:", course._id, course.title);

          // 2. Ownership check (instructor-only for now)
          const courseInstructorId = course.instructorId?.toString();
          console.log("[Outline API] Course InstructorId:", courseInstructorId);
          console.log("[Outline API] User ID from token:", userId?.toString());

          if (courseInstructorId !== userId?.toString()) {
               console.log("[Outline API] Authorization failed - instructor mismatch");
               return res.status(403).json({
                    success: false,
                    message: "Not authorized - you do not own this course",
                    debug: {
                         courseInstructorId,
                         requestUserId: userId
                    }
               });
          }

          // 3. Fetch sections
          console.log("[Outline API] Querying sections with courseObjectId:", courseObjectId);
          const sections = await Section.find({ courseId: courseObjectId })
               .sort({ order: 1 })
               .lean();
          console.log("[Outline API] Sections found:", sections.length);
          if (sections.length > 0) {
               console.log("[Outline API] Sections data:", JSON.stringify(sections, null, 2));
          }

          // 4. Fetch lessons
          console.log("[Outline API] Querying lessons with courseObjectId:", courseObjectId);
          const lessons = await Lesson.find({ courseId: courseObjectId })
               .sort({ order: 1 })
               .lean();
          console.log("[Outline API] Lessons found:", lessons.length);
          if (lessons.length > 0) {
               console.log("[Outline API] Lessons data:", JSON.stringify(lessons, null, 2));
          }

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
          console.log("[Outline API] Lesson map keys:", Object.keys(lessonMap));

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
               console.log("[Outline API] No sections found, grouping lessons by sectionId");
               
               // Get unique sectionIds from lessons
               const uniqueSectionIds = [...new Set(lessons.map(l => l.sectionId.toString()))];
               console.log("[Outline API] Unique sectionIds from lessons:", uniqueSectionIds);
               
               // Create a section for each unique sectionId found in lessons
               structuredSections = uniqueSectionIds.map((sectionId, index) => ({
                    _id: sectionId,
                    title: `Section ${index + 1}`,
                    order: index + 1,
                    lessons: lessonMap[sectionId] || []
               }));
          }

          console.log("[Outline API] Structured sections count:", structuredSections.length);

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
