import Course from "../models/course.model.js";
import Lesson from "../models/lesson.model.js";
import Progress from "../models/progress.model.js";
import Enrollment from "../models/enrollment.model.js";

export const completeLesson = async (req, res) => {
     try {
          const user = req.user;
          if (!user.isVerified) {
               return res.status(403).json({
                    success: false,
                    message: "you are not verified"
               });
          };

          const { lessonId } = req.params;
          const lesson = await Lesson.findById(lessonId);
          if (!lesson) {
               return res.status(404).json({
                    success: false,
                    message: "lesson not found"
               });
          }

          const course = await Course.findById(lesson.courseId);
          if (!course || !course.isPublished) {
               return res.status(400).json({
                    success: false,
                    message: "course not accessible"
               });
          }

          const enrolled = await Enrollment.findOne(
               {
                    userId: user._id,
                    courseId: course.id
               }
          );

          if (!enrolled) {
               return res.status(403).json({
                    success: false,
                    message: "enroll in course first"
               });
          }

          const alreadyCompleted = await Progress.findOne({
               userId: user._id,
               lessonId
          });

          if (alreadyCompleted) {
               return res.status(409).json({
                    success: false,
                    message: "lesson already completed"
               });
          }

          await Progress.create({
               userId: user._id,
               courseId: course._id,
               lessonId
          });

          return res.status(201).json({
               success: true,
               message: "lesson marked as completed"
          });

     } catch (err) {
          return res.status(500).json({
               success: false,
               message: "failed to update progress",
               error: err.message
          });
     }
};

export const getCourseProgress = async (req, res) => {
     try {
          const user = req.user;
          const { courseId } = req.params;
          if (!user.isVerified) {
               return res.status(403).json({
                    success: false,
                    message: "verification required"
               });
          };

          const course = await Course.findById(courseId);

          if (!course || !course.isPublished) {
               return res.status(404).json({
                    success: false,
                    message: "course not found"
               });
          };

          const enrolled = await Enrollment.findOne({
               userId: userId,
               courseId
          })

          if (!enrolled) {
               return res.status(403).json({
                    success: false,
                    message: "you not enrolled in course"
               });
          }

          const totalLesson = await Lesson.countDocuments({ courseId });

          const completed = await Progress.find({
               userId: user._id,
               courseId
          }).select("lessonId - _id");
          const completedLessonIds = completed.match(p => p.lessonId.string());

          const completedLessons = completedLessonIds.length;

          const per = totalLesson === 0 ? 0 : Math.floor((completeLesson / totalLesson) * 100);

          return res.status(201).json({
               success: true,
               message: {
                    totalLesson,
                    completeLesson,
                    per,
                    completedLessonIds
               }
          });
     }
     catch (err) {
          return res.status(500).json({
               success: false,
               error: err,
               message: "failed to fetch course progress"
          });
     }
}