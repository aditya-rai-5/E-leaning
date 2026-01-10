import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
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

     lessonId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lesson",
          required: true,
          index: true
     },

     completedAt: {
          type: Date,
          default: Date.now
     }
},
     { timestamps: true }
);

progressSchema.index(
     { userId: 1, lessonId: 1 },
     { unique: true }
);

export default mongoose.model("Progress", progressSchema);