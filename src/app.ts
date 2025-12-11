import express from "express";
import cors from "cors";
import { router } from "./router/route";
import passport from "passport";
import "./modules/auth/google.strategy"; // Initialize Google strategy

const app = express();

// Parse JSON bodies
app.use(express.json());

// Enable CORS
app.use(cors());

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
