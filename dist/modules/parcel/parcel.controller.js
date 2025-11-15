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
exports.ParcelController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse")); // Assuming a sendResponse utility exists
const parcel_service_1 = require("./parcel.service");
const parcel_validation_1 = require("./parcel.validation");
const pagination_1 = require("../../constants/pagination"); // Assuming pagination constants
const pick_1 = __importDefault(require("../../utils/pick")); // Assuming a pick utility for filtering
const createParcel = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Get sender ID from logged-in user
    const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!senderId) {
        throw new Error("Sender ID not provided");
    }
    // Validate body - schema now expects fields directly (not wrapped in body)
    const validatedData = parcel_validation_1.ParcelValidation.createParcelZodSchema.parse(req.body);
    // Convert deliveryDate string to Date if provided
    const parcelData = {
        type: validatedData.type,
        weight: validatedData.weight,
        receiver: validatedData.receiver,
        deliveryAddress: validatedData.deliveryAddress,
        fee: validatedData.fee,
        deliveryDate: validatedData.deliveryDate ? new Date(validatedData.deliveryDate) : undefined,
    };
    // Call service with validated data
    const result = yield parcel_service_1.ParcelService.createParcel(parcelData, senderId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Parcel created successfully!",
        data: result,
    });
}));
const getAllParcels = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, ['searchTerm', 'currentStatus']);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield parcel_service_1.ParcelService.getAllParcels(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Parcels retrieved successfully!',
        meta: result.meta,
        data: result.parcels,
    });
}));
const getSingleParcel = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId, role } = req.user;
    const { id: parcelId } = req.params;
    const result = yield parcel_service_1.ParcelService.getSingleParcel(parcelId, userId, role);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Parcel retrieved successfully!',
        data: result,
    });
}));
const getMyParcels = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = req.user;
    const filters = (0, pick_1.default)(req.query, ['searchTerm', 'currentStatus']);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield parcel_service_1.ParcelService.getMyParcels(userId, filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'My parcels retrieved successfully!',
        meta: result.meta,
        data: result.parcels,
    });
}));
const getIncomingParcels = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = req.user;
    const filters = (0, pick_1.default)(req.query, ['searchTerm', 'currentStatus']);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield parcel_service_1.ParcelService.getIncomingParcels(userId, filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Incoming parcels retrieved successfully!',
        meta: result.meta,
        data: result.parcels,
    });
}));
const updateParcel = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: parcelId } = req.params;
    const validatedData = parcel_validation_1.ParcelValidation.updateParcelZodSchema.parse(req.body);
    // Convert deliveryDate string to Date if provided
    const updateData = Object.assign(Object.assign({}, validatedData), { deliveryDate: validatedData.deliveryDate ? new Date(validatedData.deliveryDate) : undefined });
    const result = yield parcel_service_1.ParcelService.updateParcel(parcelId, updateData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Parcel updated successfully!',
        data: result,
    });
}));
const cancelParcel = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId, role } = req.user;
    const { id: parcelId } = req.params;
    const result = yield parcel_service_1.ParcelService.cancelParcel(parcelId, userId, role);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Parcel cancelled successfully!',
        data: result,
    });
}));
const updateParcelStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: parcelId } = req.params;
    const { id: updatedByUserId } = req.user;
    const validatedData = parcel_validation_1.ParcelValidation.updateParcelStatusZodSchema.parse(req.body);
    const { status, note, location } = validatedData;
    const result = yield parcel_service_1.ParcelService.updateParcelStatus(parcelId, status, updatedByUserId, note, location);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Parcel status updated successfully!',
        data: result,
    });
}));
const blockUnblockParcel = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: parcelId } = req.params;
    const { id: updatedByUserId } = req.user;
    const { isBlocked } = req.body; // Assuming isBlocked is sent in the body
    const result = yield parcel_service_1.ParcelService.blockUnblockParcel(parcelId, isBlocked, updatedByUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Parcel ${isBlocked ? 'blocked' : 'unblocked'} successfully!`,
        data: result,
    });
}));
exports.ParcelController = {
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
