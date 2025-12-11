import express from "express";
import cors from "cors";
import session from "express-session";
import { router } from "./router/route";
import passport from "passport";
import "./modules/auth/google.strategy"; // Initialize Google strategy

const app = express();

// Parse JSON bodies
app.use(express.json());

// Enable CORS
app.use(cors());

// Configure session middleware (required for Passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/v1", router);

// Home route for deployment health check
app.get("/", (req, res) => {
  res.send("Parcel Delivery System API is running!");
});

export default app;
