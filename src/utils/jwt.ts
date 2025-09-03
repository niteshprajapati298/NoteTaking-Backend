import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";

// Direct environment check
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables");
}

export interface JwtPayload {
  sub: string; 
  email: string;
  iat?: number;
  exp?: number;
}

export function signJwt(payload: JwtPayload): string {
  const secret = process.env.JWT_SECRET!;
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  
  const options: SignOptions = {
    expiresIn,
    algorithm: 'HS256'
  };
  
  return jwt.sign(payload, secret, options);
}

export function verifyJwt(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET!;
  
  const options: VerifyOptions = {
    algorithms: ['HS256']
  };
  
  return jwt.verify(token, secret, options) as JwtPayload;
}

// Optional: Helper function for creating payloads
export function createJwtPayload(userId: string, email: string): JwtPayload {
  return {
    sub: userId,
    email: email
  };
}
