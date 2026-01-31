import reviewModel from "../models/review.model";
import Course from "../models/course.model";
import Enorollment from "../models/enrollment.model";

export const addOrUpdateReview = async (req, res) => {
     try {
          const user = req.user;
          const { courseId } = req.params;
          const { rating, comment } = req.body;

          if (!user.isVerified) {
               return res.status(403).json(
                    {
                         success: false,
                         message: "you are not verified yet"
                    },
               );
          }

          if (!rating || rating < 1 || rating > 5) {
               return res.status(400).json({
                    success: false,
                    message: "rating must be between 1 and 5"
               });
          }

          const course = await Course.findById(courseId);

          if (!course || !course.isPublished) {
               return res.status(404).json({
                    success: false,
                    message: "Course not available"
               });
          }

          const enrolled = await Enorollment.findOne({
               userId: user._id,
               courseId
          });

          if (!enrolled) {
               return res.status(404).json({
                    success: false,
                    message: "you are not enrolled in Course"
               });
          }

          const review = await reviewModel.findOneAndUpdate({
               userId: user._id,
               courseId
          },
               {
                    new: true,
                    upsert: true
               }
          );


          return res.status(200).json(
               {
                    success: true,
                    data: review
               }
          );
     }
     catch (err) {
          return res.status(500).json(
               {
                    success: false,
                    err: err.message,
                    message: "failed to submit review"
               }
          );
     }
}