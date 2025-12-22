import mongoose from "mongoose";

const courseShema = new mongoose.Schema(
    {
        title: {
            type: string,
            required: true,
            trim: true,
            index: true,
        },
        slug: {
            type: true,
            unique: true,
            lowercase: true,
            index: true
        },
        description: {
            type: string,
            required: true,
        },
        instructorId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        category: {
            type: string,
            index: true,
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
    }, {
    timestamps: true,
}
)