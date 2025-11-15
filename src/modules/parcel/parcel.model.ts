import { Schema, model } from 'mongoose';
import { IParcel, IStatusLog, IParcelStatus } from './parcel.interface';

const StatusLogSchema = new Schema<IStatusLog>(
  {
    status: {
      type: String,
      enum: ['requested', 'approved', 'dispatched', 'in_transit', 'delivered', 'cancelled'],
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Assuming a User model exists
      required: true,
    },
    note: { type: String },
    location: { type: String },
  },
  { _id: false },
);

const ParcelSchema = new Schema<IParcel>(
  {
    trackingId: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    weight: { type: Number, required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
    },
    deliveryAddress: { type: String, required: true },
    fee: { type: Number },
    deliveryDate: { type: Date },
    statusLogs: { type: [StatusLogSchema], required: true },
    currentStatus: {
      type: String,
      enum: ['requested', 'approved', 'dispatched', 'in_transit', 'delivered', 'cancelled'],
      required: true,
      default: 'requested',
    },
    isBlocked: { type: Boolean, default: false },
    isCancelled: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const Parcel = model<IParcel>('Parcel', ParcelSchema);
