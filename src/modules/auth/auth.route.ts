import { Router } from "express";
import { Authcontroler } from "./auth.controller";

const router=Router()
router.post("/login",Authcontroler.credentailsLogin)
export const AuthRoutes=router;
