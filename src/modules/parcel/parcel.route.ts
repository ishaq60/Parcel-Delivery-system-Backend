import express from "express";
import { ENUM_USER_ROLE } from "../../enums/user";
import auth from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { ParcelController } from "./parcel.controller";
import { ParcelValidation } from "./parcel.validation";

const router = express.Router();

// Create a new parcel — only sender can create
router.post(
  "/create-parcel",
  auth(ENUM_USER_ROLE.SENDER, ENUM_USER_ROLE.ADMIN),
  validateRequest(ParcelValidation.createParcelZodSchema),
  ParcelController.createParcel
);


// Get all parcels — only admin
router.get(
  "/",
  auth(ENUM_USER_ROLE.ADMIN),
  ParcelController.getAllParcels
);

// Get parcels created by logged-in sender
router.get(
  "/my-parcels",
  auth(ENUM_USER_ROLE.SENDER, ENUM_USER_ROLE.ADMIN),
  ParcelController.getMyParcels
);

// Get parcels assigned to receiver (delivery person)
router.get(
  "/incoming-parcels",
  auth(ENUM_USER_ROLE.RECEIVER),
  ParcelController.getIncomingParcels
);


router.get(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SENDER, ENUM_USER_ROLE.RECEIVER),
  ParcelController.getSingleParcel
);

// Update parcel — only admin
router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(ParcelValidation.updateParcelZodSchema),
  ParcelController.updateParcel
);

// Cancel parcel (sender or admin)
router.patch(
  "/:id/cancel",
  auth(ENUM_USER_ROLE.SENDER, ENUM_USER_ROLE.ADMIN),
  ParcelController.cancelParcel
);

// Update parcel status — only admin
router.patch(
  "/:id/update-status",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(ParcelValidation.updateParcelStatusZodSchema),
  ParcelController.updateParcelStatus
);

// Block or Unblock a parcel — only admin
router.patch(
  "/:id/block-unblock",
  auth(ENUM_USER_ROLE.ADMIN),
  ParcelController.blockUnblockParcel
);

export const ParcelRoutes = router;
