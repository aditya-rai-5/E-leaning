import Course from "../models/course.model.js";
import Section from "../models/section.model.js";
import Lesson from "../models/lesson.model.js";

export const getCourseOutline = async (req, res) => {
     try {
          const { courseId } = req.params;

          // 1. Fetch course
          const course = await Course.findById(courseId).select(
               "_id title description isPublished category instructorId"
          );

          if (!course) {
               return res.status(404).json({
                    success: false,
                    message: "Course not found"
               });
          }

          // 2. Ownership check (instructor-only for now)
          if (course.instructorId.toString() !== req.user._id.toString()) {
               return res.status(403).json({
                    success: false,
                    message: "Not authorized"
               });
          }

          // 3. Fetch sections
          const sections = await Section.find({ courseId })
               .sort({ order: 1 })
               .lean();

          // 4. Fetch lessons
          const lessons = await Lesson.find({ courseId })
               .sort({ order: 1 })
               .lean();

          // 5. Group lessons by sectionId
          const lessonMap = {};
          for (const lesson of lessons) {
               const sid = lesson.sectionId.toString();
               if (!lessonMap[sid]) lessonMap[sid] = [];
               lessonMap[sid].push(lesson);
          }

          // 6. Attach lessons to sections
          const structuredSections = sections.map(section => ({
               _id: section._id,
               title: section.title,
               order: section.order,
               lessons: lessonMap[section._id.toString()] || []
          }));

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
          return res.status(500).json({
               success: false,
               message: "Failed to fetch course outline",
               error: err.message
          });
     }
};
