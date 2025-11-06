import z, { object } from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(500, { message: "Name too long (max 500 characters)" }),

  email: z
    .string()
    .email()
    .refine((val) => val.includes("@"), {
      message: "Invalid email address",
    }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" }),


phone: z
    .string()
    .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
      message:
        "Invalid Bangladeshi phone number. Example: 017xxxxxxxx or +88017xxxxxxxx",
    })
    .optional(),

  address: z.string().max(300, {
    message: "Address too long (max 300 characters)",
  }).optional(),
})
export const UserupdateZodSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(500, { message: "Name too long (max 500 characters)" }).optional(),

 

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" }).optional(),

 role: z.enum(Object.values(Role)as [string]).optional(),

 
  isActive: z.enum(Object.values(IsActive)as [string]).optional(),
phone: z
    .string()
    .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
      message:
        "Invalid Bangladeshi phone number. Example: 017xxxxxxxx or +88017xxxxxxxx",
    })
    .optional(),

  address: z.string().max(300, {
    message: "Address too long (max 300 characters)",
  }).optional(),
})