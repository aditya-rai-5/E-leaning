import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(3).max(60),
    email: z.string().email(),
    password: z.string().min(8),
    phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number"),
    interests: z.array(z.string()).optional(),
});
