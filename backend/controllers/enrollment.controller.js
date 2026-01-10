import Course from "../models/course.model.js";
import Enrollment from "../models/enrollment.model.js";

export const enrollCourse = async (req, res) => {
     try {
          const user = req.user;
          if (!user.isVerified) {
               return res.status(403).json({
                    success: false,
                    message: "verification required"
               });
          };
          const { courseId } = req.params;
          const userId = req.user._id;

          const course = await Course.findById(courseId);
          if (!course || !course.isPublished) {
               return res.status(404).json({
                    success: false,
                    message: "course not available to enrollment"
               });
          };

          if (course.instructorId.toString() === userId.toString()) {
               return res.status(400).json({
                    success: false,
                    message: "instructor not enrolled in own course"
               });
          };

          

          await Enrollment.findOneAndUpdate(
               { userId, courseId },
               { $setOnInsert: { userId, courseId } },
               { upsert: true }
          );

          return res.status(200).json({
               success: true,
               message: "Enrolled successfully"
          });
     }
     catch (err) {
          return res.status(400).json({
               success: false,
               message: "Enrollment failed",
               error: err.message
          });
     };
};