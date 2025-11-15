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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("./user.model");
const env_1 = require("../../config/env"); // ✅ adjust path as needed
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    // ✅ Check if user already exists
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (isUserExist) {
        const error = new Error("User already exists");
        error.statusCode = http_status_1.default.BAD_REQUEST;
        throw error;
    }
    // ✅ Hash password
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const authProvider = {
        provider: "credentials",
        providerID: email,
    };
    // ✅ Create new user
    const user = yield user_model_1.User.create(Object.assign({ email, password: hashedPassword, auths: [authProvider] }, rest));
    return user;
});
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (userId !== decodedToken.userId) {
        const error = new Error("You are not allowed to update this user");
        error.statusCode = http_status_1.default.UNAUTHORIZED;
        throw error;
    }
    if (payload.password) {
        const saltRounds = Number(env_1.envVars.BCRYPT_SALT_ROUNDS) || 10;
        payload.password = yield bcryptjs_1.default.hash(payload.password, saltRounds);
    }
    // ✅ Update user
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, { new: true });
    if (!updatedUser) {
        const error = new Error("User not found");
        error.statusCode = http_status_1.default.NOT_FOUND;
        throw error;
    }
    return updatedUser;
});
// ✅ Get all users
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find();
    return users;
});
exports.UserService = {
    createUser,
    updateUser,
    getAllUsers,
};
