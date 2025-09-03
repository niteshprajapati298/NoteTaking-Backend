import jwt from "jsonwebtoken";

// Direct environment check since you're using CommonJS
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables");
}

export interface JwtPayload {
  sub: string; 
  email: string;
}

export function signJwt(payload: JwtPayload): string {
  const secret = process.env.JWT_SECRET!;
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  
  return jwt.sign(payload, secret, { 
    expiresIn,
    algorithm: 'HS256' 
  });
}

export function verifyJwt(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET!;
  
  return jwt.verify(token, secret, {
    algorithms: ['HS256']
  }) as JwtPayload;
}