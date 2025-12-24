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
            enum: ["student", "Instructor"],
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

userSchema.pre("save", async function () {
    // Skip if password not modified
    if (!this.isModified("password")) return;

    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
});


// Method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        console.log("Comparing passwords...");
        console.log("Candidate password length:", candidatePassword ? candidatePassword.length : 'undefined');
        console.log("Stored password exists:", !!this.password);
        console.log("Stored password length:", this.password ? this.password.length : 'undefined');
        
        const result = await bcrypt.compare(candidatePassword, this.password);
        console.log("Password comparison result:", result);
        return result;
    } catch (error) {
        console.error("Password comparison error:", error);
        throw error;
    }
};

// Debug method to check password hash
userSchema.methods.debugPassword = function() {
    console.log("User debug info:");
    console.log("- Email:", this.email);
    console.log("- Password exists:", !!this.password);
    console.log("- Password length:", this.password ? this.password.length : 'undefined');
    console.log("- Password hash starts with:", this.password ? this.password.substring(0, 10) : 'N/A');
    return {
        email: this.email,
        hasPassword: !!this.password,
        passwordLength: this.password ? this.password.length : 0,
        passwordPrefix: this.password ? this.password.substring(0, 10) : 'N/A'
    };
};

// Create indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

const User = mongoose.model("User", userSchema);

export default User;