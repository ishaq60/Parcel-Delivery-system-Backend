// src/modules/auth/auth.service.ts

import bcryptjs from "bcryptjs";
import httpStatus from "http-status";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";

const credentailsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    const error: any = new Error("User not found");
    error.statusCode = httpStatus.BAD_REQUEST;
    throw error;
  }

  const isPasswordMatch = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatch) {
    const error: any = new Error("Password is incorrect");
    error.statusCode = httpStatus.UNAUTHORIZED;
    throw error;
  }

  const jwtPayload = {
    id: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  // issue token for 1 day
  const accessToken = generateToken(
    jwtPayload,
    envVars.jwt_Access_secret,
    envVars.jwt_Access_EXPIRES_IN
  );

  return {
    accessToken,
    user: {
      id: isUserExist._id,
      email: isUserExist.email,
      role: isUserExist.role,
    },
  };
};

export const AuthService = {
  credentailsLogin,
};
