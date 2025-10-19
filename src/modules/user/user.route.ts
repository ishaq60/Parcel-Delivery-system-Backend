import { UserControler } from './user.controller';
import { Router } from "express";

const router=Router()
router.post("/register",UserControler.createUser)
router.get("/all-users",UserControler.allUsers)

export const UserRoutes=router