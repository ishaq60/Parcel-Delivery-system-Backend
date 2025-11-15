"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelService = void 0;
const parcel_model_1 = require("./parcel.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const generateTrackingId = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const randomNum = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
    return `TRK-${year}${month}${day}-${randomNum}`;
};
const createParcel = (payload, senderId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(senderId);
    // Check if sender exists and is not blocked
    const sender = (yield user_model_1.User.findById(senderId));
    if (!sender || sender.isActive === user_interface_1.IsActive.BLOCKED || sender.isActive === user_interface_1.IsActive.INACTIVE || !sender._id) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Sender not found, blocked, inactive, or missing ID!');
    }
    const trackingId = generateTrackingId();
    const initialStatusLog = {
        status: 'requested',
        timestamp: new Date(),
        updatedBy: new mongoose_1.Types.ObjectId(sender._id), // Sender initiates the request
        note: 'Parcel requested by sender',
    };
    payload.trackingId = trackingId;
    payload.sender = new mongoose_1.Types.ObjectId(sender._id);
    payload.statusLogs = [initialStatusLog];
    payload.currentStatus = 'requested';
    payload.isBlocked = false;
    payload.isCancelled = false;
    const newParcel = yield parcel_model_1.Parcel.create(payload);
    return newParcel;
});
const getAllParcels = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, currentStatus } = filters;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = paginationOptions;
    const skip = (page - 1) * limit;
    const andConditions = [];
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
    const parcels = yield parcel_model_1.Parcel.find(whereConditions)
        .populate('sender')
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit);
    const total = yield parcel_model_1.Parcel.countDocuments(whereConditions);
    return {
        parcels,
        meta: { page, limit, total },
    };
});
const getSingleParcel = (parcelId, userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const parcel = yield parcel_model_1.Parcel.findById(parcelId).populate('sender');
    if (!parcel) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Parcel not found!');
    }
    // Admin can view any parcel
    if (role === user_interface_1.Role.ADMIN) {
        return parcel;
    }
    // Sender can view their own parcels
    if (role === user_interface_1.Role.SENDER && parcel.sender.toString() === userId) {
        return parcel;
    }
    // Receiver can view parcels addressed to them
    if (role === user_interface_1.Role.RECEIVER && parcel.receiver.phone === ((_a = (yield user_model_1.User.findById(userId))) === null || _a === void 0 ? void 0 : _a.phone)) {
        return parcel;
    }
    throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to view this parcel!');
});
const getMyParcels = (userId, filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, currentStatus } = filters;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = paginationOptions;
    const skip = (page - 1) * limit;
    const andConditions = [{ sender: new mongoose_1.Types.ObjectId(userId) }];
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
    const parcels = yield parcel_model_1.Parcel.find(whereConditions)
        .populate('sender')
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit);
    const total = yield parcel_model_1.Parcel.countDocuments(whereConditions);
    return {
        parcels,
        meta: { page, limit, total },
    };
});
const getIncomingParcels = (userId, filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, currentStatus } = filters;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = paginationOptions;
    const skip = (page - 1) * limit;
    const receiverUser = yield user_model_1.User.findById(userId);
    if (!receiverUser || !receiverUser.phone) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Receiver not found or phone number not associated!');
    }
    const andConditions = [{ 'receiver.phone': receiverUser.phone }];
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
    const parcels = yield parcel_model_1.Parcel.find(whereConditions)
        .populate('sender')
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit);
    const total = yield parcel_model_1.Parcel.countDocuments(whereConditions);
    return {
        parcels,
        meta: { page, limit, total },
    };
});
const updateParcel = (parcelId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Parcel not found!');
    }
    // Prevent direct manipulation of statusLogs or currentStatus via this generic update
    if (payload.statusLogs || payload.currentStatus) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Status logs or current status cannot be updated directly. Use updateParcelStatus.');
    }
    const updatedParcel = yield parcel_model_1.Parcel.findOneAndUpdate({ _id: parcelId }, payload, { new: true }).populate('sender');
    return updatedParcel;
});
const cancelParcel = (parcelId, userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Parcel not found!');
    }
    if (parcel.isCancelled || parcel.isBlocked) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Parcel is already cancelled or blocked.');
    }
    // Admin can cancel any parcel
    if (role === user_interface_1.Role.ADMIN) {
        const newStatusLog = {
            status: 'cancelled',
            timestamp: new Date(),
            updatedBy: new mongoose_1.Types.ObjectId(userId),
            note: 'Parcel cancelled by admin',
        };
        parcel.statusLogs.push(newStatusLog);
        parcel.currentStatus = 'cancelled';
        parcel.isCancelled = true;
        yield parcel.save();
        return parcel;
    }
    // Sender can cancel if parcel is in 'requested' or 'approved' status and they are the sender
    if (role === user_interface_1.Role.SENDER &&
        parcel.sender.toString() === userId &&
        (parcel.currentStatus === 'requested' || parcel.currentStatus === 'approved')) {
        const newStatusLog = {
            status: 'cancelled',
            timestamp: new Date(),
            updatedBy: new mongoose_1.Types.ObjectId(userId),
            note: 'Parcel cancelled by sender',
        };
        parcel.statusLogs.push(newStatusLog);
        parcel.currentStatus = 'cancelled';
        parcel.isCancelled = true;
        yield parcel.save();
        return parcel;
    }
    throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to cancel this parcel or it cannot be cancelled at its current status.');
});
const isValidStatusTransition = (current, next) => {
    var _a;
    const transitions = {
        requested: ['approved', 'cancelled'],
        approved: ['dispatched', 'cancelled'],
        dispatched: ['in_transit', 'cancelled'],
        in_transit: ['delivered', 'cancelled'],
        delivered: [], // No further transitions after delivered
        cancelled: [], // No further transitions after cancelled
    };
    return ((_a = transitions[current]) === null || _a === void 0 ? void 0 : _a.includes(next)) || false;
};
const updateParcelStatus = (parcelId, newStatus, updatedByUserId, note, location) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Parcel not found!');
    }
    if (parcel.isCancelled || parcel.isBlocked) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Parcel is cancelled or blocked. Status cannot be updated.');
    }
    if (!isValidStatusTransition(parcel.currentStatus, newStatus)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Invalid status transition from ${parcel.currentStatus} to ${newStatus}`);
    }
    const newStatusLog = {
        status: newStatus,
        timestamp: new Date(),
        updatedBy: new mongoose_1.Types.ObjectId(updatedByUserId),
        note: note || `Status updated to ${newStatus}`,
        location,
    };
    parcel.statusLogs.push(newStatusLog);
    parcel.currentStatus = newStatus;
    yield parcel.save();
    return parcel;
});
const blockUnblockParcel = (parcelId, isBlocked, updatedByUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Parcel not found!');
    }
    parcel.isBlocked = isBlocked;
    const newStatusLog = {
        status: parcel.currentStatus, // Status remains the same, but log indicates block/unblock action
        timestamp: new Date(),
        updatedBy: new mongoose_1.Types.ObjectId(updatedByUserId),
        note: isBlocked ? 'Parcel blocked by admin' : 'Parcel unblocked by admin',
    };
    parcel.statusLogs.push(newStatusLog);
    yield parcel.save();
    return parcel;
});
exports.ParcelService = {
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
