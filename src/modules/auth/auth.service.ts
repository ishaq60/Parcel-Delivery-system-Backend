// src/modules/auth/auth.service.ts

import bcryptjs from "bcryptjs";
import httpStatus from "http-status";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import ApiError from "../../errors/ApiError";

const credentailsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }

  const isPasswordMatch = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password is incorrect");
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
      name: isUserExist.name,
      picture: isUserExist.picture,
    },
  };
};

const googleLogin = async (user: IUser) => {
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }

  const jwtPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  // issue token
  const accessToken = generateToken(
    jwtPayload,
    envVars.jwt_Access_secret,
    envVars.jwt_Access_EXPIRES_IN
  );

  return {
    accessToken,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      picture: user.picture,
    },
  };
};

export const AuthService = {
  credentailsLogin,
  googleLogin,
};
