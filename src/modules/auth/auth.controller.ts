import  httpStatus  from 'http-status';

import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from './auth.service';


const credentailsLogin=async (req: Request, res: Response,next:NextFunction) => {
  try {
//   const user=await UserService.createUser(req.body)
const user=await AuthService.credentailsLogin(req.body)
    res.status(httpStatus.CREATED).json({
      success: true,
      StatusCodes:StatusCodes.OK,
      message: "User Login successfully",
      data: user, // optional but useful to return created user
    });
  } catch (error: any) {
    console.error(error);
  next(error)
}
}

export const Authcontroler={
    credentailsLogin
}