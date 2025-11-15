import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse'; // Assuming a sendResponse utility exists
import { ParcelService } from './parcel.service';
import { ParcelValidation } from './parcel.validation';
import { IParcel } from './parcel.interface';
import { paginationFields } from '../../constants/pagination'; // Assuming pagination constants
import pick from '../../utils/pick'; // Assuming a pick utility for filtering
import { Role } from '../user/user.interface';

const createParcel = catchAsync(async (req: Request, res: Response) => {
  // Get sender ID from logged-in user
  const senderId = (req.user as { id: string })?.id;
  if (!senderId) {
    throw new Error("Sender ID not provided");
  }

  // Validate body - schema now expects fields directly (not wrapped in body)
  const validatedData = ParcelValidation.createParcelZodSchema.parse(req.body);

  // Convert deliveryDate string to Date if provided
  const parcelData = {
    type: validatedData.type,
    weight: validatedData.weight,
    receiver: validatedData.receiver,
    deliveryAddress: validatedData.deliveryAddress,
    fee: validatedData.fee,
    deliveryDate: validatedData.deliveryDate ? new Date(validatedData.deliveryDate) : undefined,
  } as Partial<IParcel>;

  // Call service with validated data
  const result = await ParcelService.createParcel(parcelData, senderId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Parcel created successfully!",
    data: result,
  });
});




const getAllParcels = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', 'currentStatus']);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ParcelService.getAllParcels(filters, paginationOptions);

  sendResponse<IParcel[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Parcels retrieved successfully!',
    meta: result.meta,
    data: result.parcels,
  });
});

const getSingleParcel = catchAsync(async (req: Request, res: Response) => {
  const { id: userId, role } = req.user as { id: string; role: string };
  const { id: parcelId } = req.params;

  const result = await ParcelService.getSingleParcel(parcelId, userId, role as Role);

  sendResponse<IParcel>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Parcel retrieved successfully!',
    data: result,
  });
});

const getMyParcels = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user as { id: string };
  const filters = pick(req.query, ['searchTerm', 'currentStatus']);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ParcelService.getMyParcels(userId, filters, paginationOptions);

  sendResponse<IParcel[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My parcels retrieved successfully!',
    meta: result.meta,
    data: result.parcels,
  });
});

const getIncomingParcels = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user as { id: string };
  const filters = pick(req.query, ['searchTerm', 'currentStatus']);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ParcelService.getIncomingParcels(userId, filters, paginationOptions);

  sendResponse<IParcel[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Incoming parcels retrieved successfully!',
    meta: result.meta,
    data: result.parcels,
  });
});

const updateParcel = catchAsync(async (req: Request, res: Response) => {
  const { id: parcelId } = req.params;
  const validatedData = ParcelValidation.updateParcelZodSchema.parse(req.body);

  // Convert deliveryDate string to Date if provided
  const updateData = {
    ...validatedData,
    deliveryDate: validatedData.deliveryDate ? new Date(validatedData.deliveryDate) : undefined,
  } as Partial<IParcel>;

  const result = await ParcelService.updateParcel(parcelId, updateData);

  sendResponse<IParcel>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Parcel updated successfully!',
    data: result,
  });
});

const cancelParcel = catchAsync(async (req: Request, res: Response) => {
  const { id: userId, role } = req.user as { id: string; role: string };
  const { id: parcelId } = req.params;

  const result = await ParcelService.cancelParcel(parcelId, userId, role as Role);

  sendResponse<IParcel>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Parcel cancelled successfully!',
    data: result,
  });
});

const updateParcelStatus = catchAsync(async (req: Request, res: Response) => {
  const { id: parcelId } = req.params;
  const { id: updatedByUserId } = req.user as { id: string };
  const validatedData = ParcelValidation.updateParcelStatusZodSchema.parse(req.body);
  const { status, note, location } = validatedData;

  const result = await ParcelService.updateParcelStatus(parcelId, status, updatedByUserId, note, location);

  sendResponse<IParcel>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Parcel status updated successfully!',
    data: result,
  });
});

const blockUnblockParcel = catchAsync(async (req: Request, res: Response) => {
  const { id: parcelId } = req.params;
  const { id: updatedByUserId } = req.user as { id: string };
  const { isBlocked } = req.body; // Assuming isBlocked is sent in the body

  const result = await ParcelService.blockUnblockParcel(parcelId, isBlocked, updatedByUserId);

  sendResponse<IParcel>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Parcel ${isBlocked ? 'blocked' : 'unblocked'} successfully!`,
    data: result,
  });
});

export const ParcelController = {
  createParcel,
  getAllParcels,
  getSingleParcel,
  getMyParcels,
  getIncomingParcels,
  updateParcel,
  cancelParcel,
  updateParcelStatus,
  blockUnblockParcel,
};
