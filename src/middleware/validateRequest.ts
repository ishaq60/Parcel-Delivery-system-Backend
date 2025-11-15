import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validateRequest = (schema: ZodSchema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Handle case where body is wrapped in a 'body' property
      const dataToValidate = req.body.body || req.body;
      
      req.body = await schema.parseAsync(dataToValidate);
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
