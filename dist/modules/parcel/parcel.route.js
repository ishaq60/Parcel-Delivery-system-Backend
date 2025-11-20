"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../enums/user");
const auth_1 = __importDefault(require("../../middleware/auth"));
const validateRequest_1 = require("../../middleware/validateRequest");
const parcel_controller_1 = require("./parcel.controller");
const parcel_validation_1 = require("./parcel.validation");
const router = express_1.default.Router();
// Create a new parcel — only sender can create
router.post("/create-parcel", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SENDER, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.validateRequest)(parcel_validation_1.ParcelValidation.createParcelZodSchema), parcel_controller_1.ParcelController.createParcel);
// Get all parcels — only admin
router.get("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), parcel_controller_1.ParcelController.getAllParcels);
// Get parcels created by logged-in sender
router.get("/my-parcels", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SENDER, user_1.ENUM_USER_ROLE.ADMIN), parcel_controller_1.ParcelController.getMyParcels);
// Get parcels assigned to receiver (delivery person)
router.get("/incoming-parcels", (0, auth_1.default)(user_1.ENUM_USER_ROLE.RECEIVER), parcel_controller_1.ParcelController.getIncomingParcels);
// Get single parcel (admin, sender, receiver)
router.get("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SENDER, user_1.ENUM_USER_ROLE.RECEIVER), parcel_controller_1.ParcelController.getSingleParcel);
// Update parcel — only admin
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.validateRequest)(parcel_validation_1.ParcelValidation.updateParcelZodSchema), parcel_controller_1.ParcelController.updateParcel);
// Cancel parcel (sender or admin)
router.patch("/:id/cancel", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SENDER, user_1.ENUM_USER_ROLE.ADMIN), parcel_controller_1.ParcelController.cancelParcel);
// Update parcel status — only admin
router.patch("/:id/update-status", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.validateRequest)(parcel_validation_1.ParcelValidation.updateParcelStatusZodSchema), parcel_controller_1.ParcelController.updateParcelStatus);
// Block or Unblock a parcel — only admin
router.patch("/:id/block-unblock", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), parcel_controller_1.ParcelController.blockUnblockParcel);
exports.ParcelRoutes = router;
