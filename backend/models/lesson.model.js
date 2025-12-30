import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
     {
          title: {
               type: String,
               required: true,
               trim: true
          },

          sectionId: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "Section",
               required: true,
               index: true
          },

          courseId: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "Course",
               required: true,
               index: true
          },

          type: {
               type: String,
               enum: ["video", "article", "quiz"],
               required: true
          },

          content: {
               type: String,
               required: true
          },

          duration: {
               type: Number,
               default: 0
          },

          order: {
               type: Number,
               required: true
          },

          attachments: [
               {
                    title: { type: String, required: true },
                    url: { type: String, required: true },
                    fileType: { type: String }, // pdf, zip, ppt
                    size: { type: Number } // in KB
               }
          ]
     },
     { timestamps: true }
);


lessonSchema.index({ sectionId: 1, order: 1 });

export default mongoose.model("Lesson", lessonSchema);