// models/User.ts
import { Schema, model, Document } from "mongoose";

export interface UserDocument extends Document {
  email: string;
  name: string;
  dateOfBirth: string;
  createdAt?: Date;
}

const userSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const User = model<UserDocument>("User", userSchema);
