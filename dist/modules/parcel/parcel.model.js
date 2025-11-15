"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcel = void 0;
const mongoose_1 = require("mongoose");
const StatusLogSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User', // Assuming a User model exists
        required: true,
    },
    note: { type: String },
    location: { type: String },
}, { _id: false });
const ParcelSchema = new mongoose_1.Schema({
    trackingId: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    weight: { type: Number, required: true },
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
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
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Parcel = (0, mongoose_1.model)('Parcel', ParcelSchema);
