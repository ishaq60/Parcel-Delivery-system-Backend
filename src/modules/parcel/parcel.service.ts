import { IParcel, IParcelStatus, IStatusLog } from './parcel.interface';
import { Parcel } from './parcel.model';
import { IUser, IsActive, Role } from '../user/user.interface';
import { User } from '../user/user.model';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { Types } from 'mongoose';

const generateTrackingId = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const randomNum = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
  return `TRK-${year}${month}${day}-${randomNum}`;
};

const createParcel = async (payload: Partial<IParcel>, senderId: string): Promise<IParcel | null> => {
console.log(senderId)
  // Check if sender exists and is not blocked
  const sender = (await User.findById(senderId)) as IUser;
  if (!sender || sender.isActive === IsActive.BLOCKED || sender.isActive === IsActive.INACTIVE || !sender._id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Sender not found, blocked, inactive, or missing ID!');
  }

  const trackingId = generateTrackingId();
  const initialStatusLog: IStatusLog = {
    status: 'requested',
    timestamp: new Date(),
    updatedBy: new Types.ObjectId(sender._id), // Sender initiates the request
    note: 'Parcel requested by sender',
  };

  payload.trackingId = trackingId;
  payload.sender = new Types.ObjectId(sender._id);
  payload.statusLogs = [initialStatusLog];
  payload.currentStatus = 'requested';
  payload.isBlocked = false;
  payload.isCancelled = false;

  const newParcel = await Parcel.create(payload);
  return newParcel;
};

const getAllParcels = async (
  filters: { searchTerm?: string; currentStatus?: IParcelStatus },
  paginationOptions: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }
): Promise<{ parcels: IParcel[]; meta: { page: number; limit: number; total: number } }> => {
  const { searchTerm, currentStatus } = filters;
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = paginationOptions;

  const skip = (page - 1) * limit;

  const andConditions: any[] = [];

  if (searchTerm) {
    andConditions.push({
      $or: ['trackingId', 'receiver.name', 'receiver.phone', 'deliveryAddress'].map(field => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  if (currentStatus) {
    andConditions.push({ currentStatus });
  }

  const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};

  const parcels = await Parcel.find(whereConditions)
    .populate('sender')
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(limit);

  const total = await Parcel.countDocuments(whereConditions);

  return {
    parcels,
    meta: { page, limit, total },
  };
};

const getSingleParcel = async (parcelId: string, userId: string, role: Role): Promise<IParcel | null> => {
  const parcel = await Parcel.findById(parcelId).populate('sender');

  if (!parcel) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Parcel not found!');
  }

  // Admin can view any parcel
  if (role === Role.ADMIN) {
    return parcel;
  }

  // Sender can view their own parcels
  if (role === Role.SENDER && parcel.sender.toString() === userId) {
    return parcel;
  }

  // Receiver can view parcels addressed to them
  if (role === Role.RECEIVER && parcel.receiver.phone === (await User.findById(userId))?.phone) {
    return parcel;
  }

  throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to view this parcel!');
};

const getMyParcels = async (
  userId: string,
  filters: { searchTerm?: string; currentStatus?: IParcelStatus },
  paginationOptions: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }
): Promise<{ parcels: IParcel[]; meta: { page: number; limit: number; total: number } }> => {
  const { searchTerm, currentStatus } = filters;
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = paginationOptions;

  const skip = (page - 1) * limit;

  const andConditions: any[] = [{ sender: new Types.ObjectId(userId) }];

  if (searchTerm) {
    andConditions.push({
      $or: ['trackingId', 'receiver.name', 'receiver.phone', 'deliveryAddress'].map(field => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  if (currentStatus) {
    andConditions.push({ currentStatus });
  }

  const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};

  const parcels = await Parcel.find(whereConditions)
    .populate('sender')
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(limit);

  const total = await Parcel.countDocuments(whereConditions);

  return {
    parcels,
    meta: { page, limit, total },
  };
};

const getIncomingParcels = async (
  userId: string,
  filters: { searchTerm?: string; currentStatus?: IParcelStatus },
  paginationOptions: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }
): Promise<{ parcels: IParcel[]; meta: { page: number; limit: number; total: number } }> => {
  const { searchTerm, currentStatus } = filters;
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = paginationOptions;

  const skip = (page - 1) * limit;

  const receiverUser = await User.findById(userId);
  if (!receiverUser || !receiverUser.phone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Receiver not found or phone number not associated!');
  }

  const andConditions: any[] = [{ 'receiver.phone': receiverUser.phone }];

  if (searchTerm) {
    andConditions.push({
      $or: ['trackingId', 'sender.name', 'deliveryAddress'].map(field => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  if (currentStatus) {
    andConditions.push({ currentStatus });
  }

  const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};

  const parcels = await Parcel.find(whereConditions)
    .populate('sender')
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(limit);

  const total = await Parcel.countDocuments(whereConditions);

  return {
    parcels,
    meta: { page, limit, total },
  };
};

const updateParcel = async (parcelId: string, payload: Partial<IParcel>): Promise<IParcel | null> => {
  const parcel = await Parcel.findById(parcelId);

  if (!parcel) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Parcel not found!');
  }

  // Prevent direct manipulation of statusLogs or currentStatus via this generic update
  if (payload.statusLogs || payload.currentStatus) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Status logs or current status cannot be updated directly. Use updateParcelStatus.');
  }

  const updatedParcel = await Parcel.findOneAndUpdate({ _id: parcelId }, payload, { new: true }).populate('sender');

  return updatedParcel;
};

const cancelParcel = async (parcelId: string, userId: string, role: Role): Promise<IParcel | null> => {
  const parcel = await Parcel.findById(parcelId);

  if (!parcel) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Parcel not found!');
  }

  if (parcel.isCancelled || parcel.isBlocked) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Parcel is already cancelled or blocked.');
  }

  // Admin can cancel any parcel
  if (role === Role.ADMIN) {
    const newStatusLog: IStatusLog = {
      status: 'cancelled',
      timestamp: new Date(),
      updatedBy: new Types.ObjectId(userId),
      note: 'Parcel cancelled by admin',
    };
    parcel.statusLogs.push(newStatusLog);
    parcel.currentStatus = 'cancelled';
    parcel.isCancelled = true;
    await parcel.save();
    return parcel;
  }

  // Sender can cancel if parcel is in 'requested' or 'approved' status and they are the sender
  if (
    role === Role.SENDER &&
    parcel.sender.toString() === userId &&
    (parcel.currentStatus === 'requested' || parcel.currentStatus === 'approved')
  ) {
    const newStatusLog: IStatusLog = {
      status: 'cancelled',
      timestamp: new Date(),
      updatedBy: new Types.ObjectId(userId),
      note: 'Parcel cancelled by sender',
    };
    parcel.statusLogs.push(newStatusLog);
    parcel.currentStatus = 'cancelled';
    parcel.isCancelled = true;
    await parcel.save();
    return parcel;
  }

  throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to cancel this parcel or it cannot be cancelled at its current status.');
};

const isValidStatusTransition = (current: IParcelStatus, next: IParcelStatus): boolean => {
  const transitions: Record<IParcelStatus, IParcelStatus[]> = {
    requested: ['approved', 'cancelled'],
    approved: ['dispatched', 'cancelled'],
    dispatched: ['in_transit', 'cancelled'],
    in_transit: ['delivered', 'cancelled'],
    delivered: [], // No further transitions after delivered
    cancelled: [], // No further transitions after cancelled
  };
  return transitions[current]?.includes(next) || false;
};

const updateParcelStatus = async (
  parcelId: string,
  newStatus: IParcelStatus,
  updatedByUserId: string,
  note?: string,
  location?: string
): Promise<IParcel | null> => {
  const parcel = await Parcel.findById(parcelId);

  if (!parcel) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Parcel not found!');
  }

  if (parcel.isCancelled || parcel.isBlocked) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Parcel is cancelled or blocked. Status cannot be updated.');
  }

  if (!isValidStatusTransition(parcel.currentStatus, newStatus)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Invalid status transition from ${parcel.currentStatus} to ${newStatus}`
    );
  }

  const newStatusLog: IStatusLog = {
    status: newStatus,
    timestamp: new Date(),
    updatedBy: new Types.ObjectId(updatedByUserId),
    note: note || `Status updated to ${newStatus}`,
    location,
  };

  parcel.statusLogs.push(newStatusLog);
  parcel.currentStatus = newStatus;

  await parcel.save();
  return parcel;
};

const blockUnblockParcel = async (parcelId: string, isBlocked: boolean, updatedByUserId: string): Promise<IParcel | null> => {
  const parcel = await Parcel.findById(parcelId);

  if (!parcel) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Parcel not found!');
  }

  parcel.isBlocked = isBlocked;

  const newStatusLog: IStatusLog = {
    status: parcel.currentStatus, // Status remains the same, but log indicates block/unblock action
    timestamp: new Date(),
    updatedBy: new Types.ObjectId(updatedByUserId),
    note: isBlocked ? 'Parcel blocked by admin' : 'Parcel unblocked by admin',
  };
  parcel.statusLogs.push(newStatusLog);

  await parcel.save();
  return parcel;
};

export const ParcelService = {
  createParcel,
  getAllParcels,
  getSingleParcel,
  getMyParcels,
  getIncomingParcels,
  updateParcel,
  cancelParcel,
  updateParcelStatus,
  blockUnblockParcel,
  generateTrackingId,
};
