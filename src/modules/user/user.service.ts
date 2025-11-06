import httpStatus from "http-status";
import bcryptjs from "bcryptjs";
import { IAuth, IUser } from "./user.interface";
import { User } from "./user.model";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env"; // ✅ adjust path as needed

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  // ✅ Check if user already exists
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    const error = new Error("User already exists");
    (error as any).statusCode = httpStatus.BAD_REQUEST;
    throw error;
  }

  // ✅ Hash password
  const hashedPassword = await bcryptjs.hash(password as string, 10);

  const authProvider: IAuth = {
    provider: "credentials",
    providerID: email as string,
  };

  // ✅ Create new user
  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });

  return user;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {

  if (userId !== decodedToken.userId) {
    const error = new Error("You are not allowed to update this user");
    (error as any).statusCode = httpStatus.UNAUTHORIZED;
    throw error;
  }


  if (payload.password) {
    const saltRounds = Number(envVars.BCRYPT_SALT_ROUNDS) || 10;
    payload.password = await bcryptjs.hash(payload.password, saltRounds);
  }

  // ✅ Update user
  const updatedUser = await User.findByIdAndUpdate(userId, payload, { new: true });

  if (!updatedUser) {
    const error = new Error("User not found");
    (error as any).statusCode = httpStatus.NOT_FOUND;
    throw error;
  }

  return updatedUser;
};

// ✅ Get all users
const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

export const UserService = {
  createUser,
  updateUser,
  getAllUsers,
};
