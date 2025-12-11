"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const route_1 = require("./router/route");
const passport_1 = __importDefault(require("passport"));
require("./modules/auth/google.strategy"); // Initialize Google strategy
const app = (0, express_1.default)();
// Parse JSON bodies
app.use(express_1.default.json());
// Enable CORS
app.use((0, cors_1.default)());
// Configure session middleware (required for Passport)
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
}));
// Initialize Passport
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Routes
app.use("/api/v1", route_1.router);
// Home route for deployment health check
app.get("/", (req, res) => {
    res.send("Parcel Delivery System API is running!");
});
exports.default = app;
