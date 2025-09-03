import dotenv from "dotenv";
dotenv.config();


export const env = {
PORT: Number(process.env.PORT || 5000),
MONGO_URI: process.env.MONGO_URI as string,
JWT_SECRET: process.env.JWT_SECRET as string,
JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
COOKIE_SECURE: process.env.COOKIE_SECURE === "true",
EMAIL_USER: process.env.EMAIL_USER as string,
EMAIL_PASS: process.env.EMAIL_PASS as string,
GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
CLIENT_ORIGIN: process.env.CLIENT_ORIGIN as string,
};