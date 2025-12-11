import { Router } from "express";
import { Authcontroler } from "./auth.controller";
import passport from "passport";

const router = Router();

// Credentials login
router.post("/login", Authcontroler.credentailsLogin);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  Authcontroler.googleLoginCallback
);

export const AuthRoutes = router;
