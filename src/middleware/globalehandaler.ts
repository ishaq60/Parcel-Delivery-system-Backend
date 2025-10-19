import { NextFunction, Request, Response } from "express";

 export const globalerrorhandaler=(err: any, req: Request, res: Response, next: NextFunction) => {

  res.status(500).json({
    success: false,
    message: `Something went wrong: ${err.message}`,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}