import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema
     (
          {
               userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: "User",
                    index: true
               },
               courseId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: "Course",
                    index: true
               },
               rating: {
                    type: Number,
                    required: true,
                    min: 1,
                    max: 5
               },
               comment: {
                    type: String,
                    trim: true,
                    maxlength: 1000,
               }
          },
          {
               timeseries: true,
          }
     );

reviewSchema.index(
     { userId: 1, courseId: 1 },
     { unique: true }
);

export default mongoose.model("Review",reviewSchema);