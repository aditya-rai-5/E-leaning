import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

/**
 * Generate JWT
 */
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        }
    );
};

/**
 * Register User
 * POST /api/auth/register
 */
export const registerUser = async (req, res, next) => {
    try {
        registerSchema.parse(req.body);

        const { name, email, password, phone, interests } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email",
            });
        }

        // IMPORTANT: pass plain password
        const user = await User.create({
            name,
            email,
            password,
            phone,
            interests,
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                success: false,
                message: error.errors[0].message,
            });
        }
        next(error);
    }
};

/**
 * Login User
 * POST /api/auth/login
 */
export const loginUser = async (req, res, next) => {
    try {
        // Validate input using loginSchema
        loginSchema.parse(req.body);

        const { email, password } = req.body;

        // Find user and explicitly select password field
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            console.log(`Login failed: User not found for email: ${email}`);
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Debug password verification
        const isPasswordValid = await user.comparePassword(password);
        console.log(`Password verification result for ${email}:`, isPasswordValid);
        
        if (!isPasswordValid) {
            console.log(`Login failed: Invalid password for email: ${email}`);
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Update last login time
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

        console.log(`Login successful for user: ${email}`);
    } catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                success: false,
                message: error.errors[0].message,
            });
        }
        console.error("Login error:", error);
        next(error);
    }
};
