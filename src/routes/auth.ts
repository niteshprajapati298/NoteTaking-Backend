import { Router, Request, Response } from "express";
import * as crypto from "crypto";
import jwt from "jsonwebtoken";
import { transporter } from "../utils/mailer";
import { emailSchema, otpVerifySchema, signUpSchema } from "../validators/auth";
import { Otp, OtpDocument } from "../models/Otp";
import { User, UserDocument } from "../models/User";
import { requireAuth } from "../middleware/auth";
import { NONAME } from "dns";

const router = Router();

function setAuthCookie(res: Response, token: string) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: true, 
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function signJwt(payload: object) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

router.post("/check-user", async (req, res) => {
  try {
    const parsed = emailSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }

    const { email } = parsed.data;
    const user: UserDocument | null = await User.findOne({ email });
    
    res.json({ 
      exists: !!user,
      user: user ? { id: user.id, email: user.email, name: user.name } : null
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/send-otp", async (req, res) => {
  try {
    const parsed = emailSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }

    const { email } = parsed.data;
    
    const user: UserDocument | null = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        error: "User not found. Please sign up first.",
        needsSignup: true 
      });
    }

    const code = crypto.randomInt(100000, 999999).toString();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Login OTP Code",
      text: `Your login OTP is ${code}. It expires in 5 minutes.`,
    });

    res.json({ message: "Login OTP sent" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/send-signup-otp", async (req, res) => {
  try {
    const parsed = signUpSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }

    const { email, name, dateOfBirth } = parsed.data;
    
    const existingUser: UserDocument | null = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        error: "User already exists. Please use login instead.",
        userExists: true 
      });
    }

    const code = crypto.randomInt(100000, 999999).toString();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      code,
      userData: { name, dateOfBirth },
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Signup OTP Code",
      text: `Welcome! Your signup OTP is ${code}. It expires in 5 minutes.`,
    });

    res.json({ message: "Signup OTP sent" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/verify-login-otp", async (req, res) => {
  try {
    const parsed = otpVerifySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }

    const { email, code } = parsed.data;
    
    const otpRecord: OtpDocument | null = await Otp.findOne({ email, code });
    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

  
    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteMany({ email });
      return res.status(400).json({ error: "OTP has expired" });
    }

   
    const user: UserDocument | null = await User.findOne({ email });
    if (!user) {
      await Otp.deleteMany({ email });
      return res.status(404).json({ error: "User not found" });
    }

   
    await Otp.deleteMany({ email });

    const token = signJwt({ sub: user.id, email: user.email });
    setAuthCookie(res, token);
  

    res.json({
      message: "Login successful",
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        dateOfBirth: user.dateOfBirth 
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
  

router.post("/verify-signup-otp", async (req, res) => {
  try {
    const parsed = otpVerifySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }

    const { email, code } = parsed.data;
    
    
    const otpRecord: OtpDocument | null = await Otp.findOne({ email, code });
    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteMany({ email });
      return res.status(400).json({ error: "OTP has expired" });
    }

    
    const existingUser: UserDocument | null = await User.findOne({ email });
    if (existingUser) {
      await Otp.deleteMany({ email });
      return res.status(400).json({ error: "User already exists" });
    }

  
    const userData = otpRecord.userData || {};
    if (!userData.name || !userData.dateOfBirth) {
      await Otp.deleteMany({ email });
      return res.status(400).json({ error: "Incomplete signup data" });
    }

    const user: UserDocument = await User.create({
      email,
      name: userData.name,
      dateOfBirth: userData.dateOfBirth,
    });

    
    await Otp.deleteMany({ email });

    const token = signJwt({ sub: user.id, email: user.email });
    setAuthCookie(res, token);

    res.json({
      message: "Signup successful",
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        dateOfBirth: user.dateOfBirth 
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});





router.post("/logout", requireAuth, (_req, res) => {

  res.clearCookie("token",{
    httpOnly:true,
    secure:true,
    sameSite:'none',
    path:'/'
  });
  res.json({ message: "Logged out" });
});
router.get("/me", requireAuth, async (req: Request, res: Response) => {
  const { sub } = (req as any).user; // sub = user id from JWT
  const user = await User.findById(sub).select("id email name dateOfBirth");

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({ user });
});


export default router;
