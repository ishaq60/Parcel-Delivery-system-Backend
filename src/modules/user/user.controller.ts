/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status"; // ✅ fixed import syntax
import { UserService } from "./user.service";
import { success } from "zod";

export const createUser = async (req: Request, res: Response,next:NextFunction) => {
  try {
  const user=await UserService.createUser(req.body)

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "User created successfully",
      data: user, // optional but useful to return created user
    });
  } catch (error: any) {
    console.error(error);
  next(error)
}
}

//getall users
const allUsers= async (req: Request, res: Response,next:NextFunction) =>{
  try {
    const users=await UserService.getAllusers()
 res.status(httpStatus.OK).json({
  success:true,
  message:"Users retried successfully",
  data:users
 })
  } catch (error) {
    console.log(error)
    next(error)
  }
}



export const UserControler={
    createUser,allUsers
}