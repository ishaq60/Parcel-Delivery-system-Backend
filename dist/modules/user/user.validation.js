"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserupdateZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string()
        .min(2, { message: "Name must be at least 2 characters" })
        .max(500, { message: "Name too long (max 500 characters)" }),
    email: zod_1.default
        .string()
        .email()
        .refine((val) => val.includes("@"), {
        message: "Invalid email address",
    }),
    password: zod_1.default
        .string()
        .min(6, { message: "Password must be at least 6 characters" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" }),
    phone: zod_1.default
        .string()
        .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
        message: "Invalid Bangladeshi phone number. Example: 017xxxxxxxx or +88017xxxxxxxx",
    })
        .optional(),
    address: zod_1.default.string().max(300, {
        message: "Address too long (max 300 characters)",
    }).optional(),
});
exports.UserupdateZodSchema = zod_1.default.object({
    name: zod_1.default
        .string()
        .min(2, { message: "Name must be at least 2 characters" })
        .max(500, { message: "Name too long (max 500 characters)" }).optional(),
    password: zod_1.default
        .string()
        .min(6, { message: "Password must be at least 6 characters" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" }).optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.Role)).optional(),
    isActive: zod_1.default.enum(Object.values(user_interface_1.IsActive)).optional(),
    phone: zod_1.default
        .string()
        .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
        message: "Invalid Bangladeshi phone number. Example: 017xxxxxxxx or +88017xxxxxxxx",
    })
        .optional(),
    address: zod_1.default.string().max(300, {
        message: "Address too long (max 300 characters)",
    }).optional(),
});
