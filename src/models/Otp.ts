// models/Otp.ts
import { Schema, model, Document } from "mongoose";

// Updated interface to match the new schema
export interface OtpDocument extends Document {
  email: string;
  code: string;
  userData?: {
    name?: string;
    dateOfBirth?: string;
  };
  expiresAt: Date;
  createdAt?: Date;
}

// Schema definition
const otpSchema = new Schema<OtpDocument>({
  email: { type: String, required: true },
  code: { type: String, required: true },
  userData: {
    name: { type: String },
    dateOfBirth: { type: String },
  },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Index for automatic expiry
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Export the model
export const Otp = model<OtpDocument>("Otp", otpSchema);
