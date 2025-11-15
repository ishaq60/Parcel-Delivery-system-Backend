import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ParcelRoutes } from "../modules/parcel/parcel.route"; // Import ParcelRoutes

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path:"/auth",
    route:AuthRoutes,
  },
  {
    path: "/parcels", // Add parcel routes
    route: ParcelRoutes,
  }
];

moduleRoutes.forEach((r) => {
  router.use(r.path, r.route);
});
