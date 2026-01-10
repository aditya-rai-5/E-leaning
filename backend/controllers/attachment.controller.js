import Lesson from "../models/lesson.model.js";
import Course from "../models/course.model.js";

export const addAttachment = async (req, res) => {
     try {
          const lessonId = req.params.lessonId;  // Fixed: extract lessonId from params
          const { title, url, fileType, size } = req.body;

          if (!title || !url) {
               return res.status(400).json({
                    success: false,
                    message: "title and url is mandatory"
               });
          };

          const lesson = await Lesson.findById(lessonId);
          if (!lesson) {
               return res.status(404).json({  // Fixed: .json() instead of .res()
                    success: false,
                    message: "lesson not found"
               });
          };

          const course = await Course.findById(lesson.courseId);
          if (!course) {
               return res.status(404).json({  // Fixed: .json() instead of .res()
                    success: false,
                    message: "course not found"
               });
          };

          if (course.instructorId.toString() != req.user._id.toString()) {
               return res.status(403).json({  // Fixed: res.status() instead of req.status()
                    success: false,
                    message: "unauthorized"
               });
          };


          lesson.attachments.push({
               title,
               url,
               fileType,
               size
          });

          await lesson.save();

          return res.status(201).json({
               success: true,
               data: lesson.attachments
          });

     } catch (err) {
          return res.status(500).json({
               success: false,
               message: "Failed to add attachment",
               error: err.message
          });
     }
};
