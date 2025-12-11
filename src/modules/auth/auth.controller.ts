import httpStatus from 'http-status';

import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from './auth.service';
import { IUser } from '../user/user.interface';

const credentailsLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await AuthService.credentailsLogin(req.body);
    res.status(httpStatus.CREATED).json({
      success: true,
      StatusCodes: StatusCodes.OK,
      message: "User Login successfully",
      data: user,
    });
  } catch (error: unknown) {
    console.error(error);
    next(error);
  }
};

const googleLoginCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUser;
    const result = await AuthService.googleLogin(user);
    
    res.status(httpStatus.OK).json({
      success: true,
      StatusCodes: StatusCodes.OK,
      message: "Google login successful",
      data: result,
    });
  } catch (error: unknown) {
    console.error(error);
    next(error);
  }
};

export const Authcontroler = {
  credentailsLogin,
  googleLoginCallback,
};