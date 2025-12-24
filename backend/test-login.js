import mongoose from "mongoose";
import User from "./models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

async function testLogin() {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: "elearning" });
        console.log("Connected to MongoDB");

        // Find the user
        const user = await User.findOne({ email: "instructor@test.com" }).select("+password");
        
        if (!user) {
            console.log("❌ User not found");
            process.exit(1);
        }

        console.log("✅ User found:", user.email);
        console.log("📝 Password hash length:", user.password.length);
        console.log("🔍 Password hash starts with:", user.password.substring(0, 20));

        // Test password comparison
        const isValid = await user.comparePassword("Test@1234");
        console.log("\n🔐 Password 'Test@1234' is valid?", isValid);

        if (isValid) {
            console.log("✅ Login should work!");
        } else {
            console.log("❌ Login will fail - password mismatch");
            console.log("\nTry deleting the user and re-registering:");
            console.log("  db.users.deleteOne({ email: 'instructor@test.com' })");
        }

        process.exit(0);
    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
}

testLogin();
