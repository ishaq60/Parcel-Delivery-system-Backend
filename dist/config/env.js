"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
// src/config/env.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const loadEnvironmentVariables = () => {
    const requiredVars = [
        "PORT",
        "DB_URL",
        "NODE_ENV",
        "jwt_Access_secret",
        "jwt_Access_EXPIRES_IN",
        "BCRYPT_SALT_ROUNDS",
    ];
    requiredVars.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing required environment variable: ${key}`);
        }
    });
    return {
        PORT: process.env.PORT,
        DB_URL: process.env.DB_URL,
        NODE_ENV: process.env.NODE_ENV,
        jwt_Access_secret: process.env.jwt_Access_secret,
        jwt_Access_EXPIRES_IN: process.env.jwt_Access_EXPIRES_IN,
        BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    };
};
exports.envVars = loadEnvironmentVariables();
