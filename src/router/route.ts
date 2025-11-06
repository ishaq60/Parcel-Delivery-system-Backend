import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path:"/auth",
    route:AuthRoutes,
  }
];

moduleRoutes.forEach((r) => {
  router.use(r.path, r.route);
});
