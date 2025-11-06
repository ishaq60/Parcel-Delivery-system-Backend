import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";

// ✅ Generate JWT Token
export const generateToken = (
  payload: object,
  secret: string,
  expiresIn: string // <-- direct string, not object
): string => {
  const token = jwt.sign(payload, secret, { expiresIn } as SignOptions);
  return token;
};

// ✅ Verify Token
export const verifyToken = (token: string, secret: string): JwtPayload => {
  const verifiedToken = jwt.verify(token, secret) as JwtPayload;
  return verifiedToken;
};
