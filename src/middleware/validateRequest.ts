import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validateRequest = (schema: ZodSchema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
   
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.errors || error.message,
      });
    }
  };
};
