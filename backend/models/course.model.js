import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        index: true
    },

    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true
    },

    description: {
        type: String,
        required: true
    },

    instructorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    category: {
        type: String,
        index: true
    },

    level: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "beginner"
    },

    language: {
        type: String,
        default: "English"
    },

    thumbnail: {
        type: String
    },

    price: {
        type: Number,
        default: 0
    },

    isPublished: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });


const Course = mongoose.model("Course", CourseSchema);
export default Course;