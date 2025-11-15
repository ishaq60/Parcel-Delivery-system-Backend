import { Types } from 'mongoose';

export type IParcelStatus = 'requested' | 'approved' | 'dispatched' | 'in_transit' | 'delivered' | 'cancelled';

export interface IStatusLog {
  status: IParcelStatus;
  timestamp: Date;
  updatedBy: Types.ObjectId; // User ID (admin/system)
  note?: string;
  location?: string; // Optional: for 'in_transit' or 'picked' statuses
}

export interface IParcel {
  trackingId: string;
  type: string;
  weight: number;
  sender: Types.ObjectId; // User ID
  receiver: {
    name: string;
    address: string;
    phone: string;
    email?: string;
  };
  deliveryAddress: string;
  fee?: number; // Optional
  deliveryDate?: Date; // Estimated or actual delivery date
  statusLogs: IStatusLog[];
  currentStatus: IParcelStatus;
  isBlocked: boolean; // For admin to block parcels
  isCancelled: boolean; // For sender to cancel parcels
}
