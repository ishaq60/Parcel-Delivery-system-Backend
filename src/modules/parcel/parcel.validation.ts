import { z } from 'zod';
import { IParcelStatus } from './parcel.interface';

const createParcelZodSchema = z.object({
  type: z.string().min(1, 'Parcel type is required'),
  weight: z.number().positive('Weight must be a positive number'),
  receiver: z.object({
    name: z.string().min(1, 'Receiver name is required'),
    address: z.string().min(1, 'Receiver address is required'),
    phone: z.string().min(1, 'Receiver phone is required'),
    email: z.string().email('Invalid email address').optional(),
  }),
  deliveryAddress: z.string().min(1, 'Delivery address is required'),
  fee: z.number().positive('Fee must be a positive number').optional(),
  deliveryDate: z
    .string()
    .optional()
    .refine(val => !val || !isNaN(Date.parse(val)), {
      message: 'Invalid date format, expected YYYY-MM-DD or ISO datetime',
    }),
  id: z.string().optional(),
});

const updateParcelZodSchema = z.object({
  type: z.string().optional(),
  weight: z.number().positive('Weight must be a positive number').optional(),
  receiver: z.object({
    name: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Invalid email address').optional(),
  }).optional(),
  deliveryAddress: z.string().optional(),
  fee: z.number().positive('Fee must be a positive number').optional(),
  deliveryDate: z
    .string()
    .optional()
    .refine(val => !val || !isNaN(Date.parse(val)), {
      message: 'Invalid date format, expected YYYY-MM-DD or ISO datetime',
    }),
  currentStatus: z.enum(['requested', 'approved', 'dispatched', 'in_transit', 'delivered', 'cancelled']).optional(),
  isBlocked: z.boolean().optional(),
  isCancelled: z.boolean().optional(),
});

const updateParcelStatusZodSchema = z.object({
  status: z.enum(['approved', 'dispatched', 'in_transit', 'delivered', 'cancelled']),
  note: z.string().optional(),
  location: z.string().optional(),
});

export const ParcelValidation = {
  createParcelZodSchema,
  updateParcelZodSchema,
  updateParcelStatusZodSchema,
};
