import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
     {
          userId: {
               type: mongoose.Schema.Types.ObjectId,
               required: true,
               ref: "User",
               index: true,
          },

          courseId: {
               type: mongoose.Schema.Types.ObjectId,
               required: true,
               ref: "Course",
          },

          enrolledAt: {
               type: Date,
               default: Date.now,
          },
     },
     {
          timestamps: true,
     },
);

enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model("Enrollment", enrollmentSchema);