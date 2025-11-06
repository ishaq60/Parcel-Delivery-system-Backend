import { Router, Request, Response, NextFunction } from "express";
import { UserControler } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "./user.interface";

const router = Router();

// ✅ Register route
router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControler.createUser
);

// ✅ Protected route (ADMIN only)
router.get(
  "/all-users",
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
      }

      const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[2]
        : authHeader;

      // ✅ Decode token safely
      const verifiedToken = jwt.verify(token, "secret") as JwtPayload;
      console.log("Decoded token:", verifiedToken);

      // ✅ Role-based access control
      if (verifiedToken.role !== Role.ADMIN) {
        return res.status(403).json({
          message: "You are not allowed to access this route",
        });
      }

      (req as any).user = verifiedToken;
      next();
    } catch (error: any) {
      console.error("Token verification error:", error);
      return res.status(403).json({
        message:
          error.name === "TokenExpiredError"
            ? "Token expired"
            : error.name === "JsonWebTokenError"
            ? "Invalid token"
            : "Forbidden access",
      });
    }
  },
  UserControler.allUsers
);

export const UserRoutes = router;
