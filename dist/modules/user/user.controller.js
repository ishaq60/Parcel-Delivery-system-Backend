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
exports.UserControler = exports.createUser = void 0;
const http_status_1 = __importDefault(require("http-status")); // ✅ fixed import syntax
const user_service_1 = require("./user.service");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_service_1.UserService.createUser(req.body);
        res.status(http_status_1.default.CREATED).json({
            success: true,
            message: "User created successfully",
            data: user, // optional but useful to return created user
        });
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});
exports.createUser = createUser;
//getall users
const allUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_service_1.UserService.getAllUsers();
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "Users retried successfully",
            data: users
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.UserControler = {
    createUser: exports.createUser, allUsers
};
