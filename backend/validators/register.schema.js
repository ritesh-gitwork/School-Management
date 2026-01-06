import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({ required_error: "name is required" })
    .trim()
    .min(2, { message: "name must be at least 3 characters" }),

  email: z
    .string({ required_error: "email is required" })
    .email({ message: "invalid email address" }),

  password: z
    .string({ required_error: "password is required" })
    .min(6, { message: "password must be 6 characters long" }),

  role: z.enum(["teacher", "student"]),
});
