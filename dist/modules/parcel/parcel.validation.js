"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelValidation = void 0;
const zod_1 = require("zod");
const createParcelZodSchema = zod_1.z.object({
    type: zod_1.z.string().min(1, 'Parcel type is required'),
    weight: zod_1.z.number().positive('Weight must be a positive number'),
    receiver: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Receiver name is required'),
        address: zod_1.z.string().min(1, 'Receiver address is required'),
        phone: zod_1.z.string().min(1, 'Receiver phone is required'),
        email: zod_1.z.string().email('Invalid email address').optional(),
    }),
    deliveryAddress: zod_1.z.string().min(1, 'Delivery address is required'),
    fee: zod_1.z.number().positive('Fee must be a positive number').optional(),
    deliveryDate: zod_1.z
        .string()
        .optional()
        .refine(val => !val || !isNaN(Date.parse(val)), {
        message: 'Invalid date format, expected YYYY-MM-DD or ISO datetime',
    }),
    id: zod_1.z.string().optional(),
});
const updateParcelZodSchema = zod_1.z.object({
    type: zod_1.z.string().optional(),
    weight: zod_1.z.number().positive('Weight must be a positive number').optional(),
    receiver: zod_1.z.object({
        name: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
        email: zod_1.z.string().email('Invalid email address').optional(),
    }).optional(),
    deliveryAddress: zod_1.z.string().optional(),
    fee: zod_1.z.number().positive('Fee must be a positive number').optional(),
    deliveryDate: zod_1.z
        .string()
        .optional()
        .refine(val => !val || !isNaN(Date.parse(val)), {
        message: 'Invalid date format, expected YYYY-MM-DD or ISO datetime',
    }),
    currentStatus: zod_1.z.enum(['requested', 'approved', 'dispatched', 'in_transit', 'delivered', 'cancelled']).optional(),
    isBlocked: zod_1.z.boolean().optional(),
    isCancelled: zod_1.z.boolean().optional(),
});
const updateParcelStatusZodSchema = zod_1.z.object({
    status: zod_1.z.enum(['approved', 'dispatched', 'in_transit', 'delivered', 'cancelled']),
    note: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
});
exports.ParcelValidation = {
    createParcelZodSchema,
    updateParcelZodSchema,
    updateParcelStatusZodSchema,
};
