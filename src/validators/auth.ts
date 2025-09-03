
import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const otpVerifySchema = z.object({
  email: z.string().email("Invalid email format"),
  code: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

export const signUpSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
});
