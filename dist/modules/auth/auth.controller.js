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
exports.Authcontroler = void 0;
const http_status_1 = __importDefault(require("http-status"));
const http_status_codes_1 = require("http-status-codes");
const auth_service_1 = require("./auth.service");
const credentailsLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //   const user=await UserService.createUser(req.body)
        const user = yield auth_service_1.AuthService.credentailsLogin(req.body);
        res.status(http_status_1.default.CREATED).json({
            success: true,
            StatusCodes: http_status_codes_1.StatusCodes.OK,
            message: "User Login successfully",
            data: user, // optional but useful to return created user
        });
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});
exports.Authcontroler = {
    credentailsLogin
};
