"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const validateRequest_1 = require("../../middleware/validateRequest");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_interface_1 = require("./user.interface");
const router = (0, express_1.Router)();
// ✅ Register route
router.post("/register", (0, validateRequest_1.validateRequest)(user_validation_1.createUserZodSchema), user_controller_1.UserControler.createUser);
// ✅ Protected route (ADMIN only)
router.get("/all-users", (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[2]
            : authHeader;
        // ✅ Decode token safely
        const verifiedToken = jsonwebtoken_1.default.verify(token, "secret");
        console.log("Decoded token:", verifiedToken);
        // ✅ Role-based access control
        if (verifiedToken.role !== user_interface_1.Role.ADMIN) {
            return res.status(403).json({
                message: "You are not allowed to access this route",
            });
        }
        req.user = verifiedToken;
        next();
    }
    catch (error) {
        console.error("Token verification error:", error);
        return res.status(403).json({
            message: error.name === "TokenExpiredError"
                ? "Token expired"
                : error.name === "JsonWebTokenError"
                    ? "Invalid token"
                    : "Forbidden access",
        });
    }
}, user_controller_1.UserControler.allUsers);
exports.UserRoutes = router;
