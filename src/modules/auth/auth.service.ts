// src/modules/auth/auth.service.ts

import bcryptjs from "bcryptjs";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { envVars } from "../../config/env";
import { generateToken } from "../../utils/jwt";

const credentailsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    const error = new Error("User not found");
    (error as any).statusCode = httpStatus.BAD_REQUEST;
    throw error;
  }

  const isPasswordMatch = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatch) {
    const error = new Error("Password is incorrect");
    (error as any).statusCode = httpStatus.UNAUTHORIZED;
    throw error;
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  // const accessToken = jwt.sign(jwtPayload, envVars.jwt_Access_secret, {
  //   expiresIn: envVars.jwt_Access_EXPIRES_IN,
  // });

const accessToken = generateToken(jwtPayload, process.env.JWT_SECRET!, "1d");

res.status(200).json({
  message: "Login successful",
  token: accessToken,
});

  return { accessToken };
};

export const AuthService = {
  credentailsLogin,
};
