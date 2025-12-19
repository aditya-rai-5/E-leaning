import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 60,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
        },

        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false,
        },

        phone: {
            type: String,
            required: true,
            match: [/^\+?[1-9]\d{9,14}$/, "Invalid phone number"],
        },

        role: {
            type: String,
            enum: ["student", "admin"],
            default: "student",
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        interests: [
            {
                type: String,
                enum: [
                    "web-development",
                    "machine-learning",
                    "robotics",
                    "data-structures",
                    "system-design",
                    "artificial-intelligence",
                ],
            },
        ],

        lastLogin: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre("save", async function(next) {
    // Only hash password if it's been modified (or is new)
    if (!this.isModified("password")) {
        return next();
    }

    try {
        // Hash password with cost of 12
        const saltRounds = 12;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// Create indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

const User = mongoose.model("User", userSchema);

export default User;
