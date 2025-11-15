"use strict";
// src/modules/auth/auth.service.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("../user/user.model");
const jwt_1 = require("../../utils/jwt");
const env_1 = require("../../config/env");
const credentailsLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (!isUserExist) {
        const error = new Error("User not found");
        error.statusCode = http_status_1.default.BAD_REQUEST;
        throw error;
    }
    const isPasswordMatch = yield bcryptjs_1.default.compare(password, isUserExist.password);
    if (!isPasswordMatch) {
        const error = new Error("Password is incorrect");
        error.statusCode = http_status_1.default.UNAUTHORIZED;
        throw error;
    }
    const jwtPayload = {
        id: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
    };
    // issue token for 1 day
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.jwt_Access_secret, env_1.envVars.jwt_Access_EXPIRES_IN);
    return {
        accessToken,
        user: {
            id: isUserExist._id,
            email: isUserExist.email,
            role: isUserExist.role,
        },
    };
});
exports.AuthService = {
    credentailsLogin,
};
