"use strict";
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
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const jwt_1 = require("../utils/jwt");
const env_1 = require("../config/env");
const auth = (...requiredRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        let token;
        // Get token from header, cookie, query, or body
        const rawAuthHeader = req.headers.authorization || req.headers.Authorization;
        if (Array.isArray(rawAuthHeader))
            token = rawAuthHeader[0];
        else
            token = rawAuthHeader;
        token = token || req.headers['x-access-token'] || ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token);
        token = token || ((_b = req.query) === null || _b === void 0 ? void 0 : _b.token) || ((_c = req.body) === null || _c === void 0 ? void 0 : _c.token);
        if (!token || token === 'null' || token === 'undefined') {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized');
        }
        // Remove 'Bearer ' prefix
        const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;
        // Verify token
        const verifiedUser = (0, jwt_1.verifyToken)(actualToken, env_1.envVars.jwt_Access_secret);
        // Normalize user object for consistent controller access
        req.user = {
            id: verifiedUser.id || verifiedUser.userId,
            email: verifiedUser.email,
            role: verifiedUser.role,
        };
        // Check roles (case-insensitive)
        if (requiredRoles.length) {
            const roleMatches = requiredRoles.some((role) => role.toUpperCase() === verifiedUser.role.toUpperCase());
            if (!roleMatches) {
                throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden');
            }
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.default = auth;
