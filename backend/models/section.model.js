import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true,
            ref: "Course",
        },
        order: {
            type: Number,
            required: true,
        }
    },
    {
        timestamps: true,
    }
)

sectionSchema.index({ courseId: 1, order: 1 });

export default mongoose.model("Section", sectionSchema);