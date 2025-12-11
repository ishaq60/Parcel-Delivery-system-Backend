"use strict";
// src/modules/auth/google.strategy.ts
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
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_1 = __importDefault(require("passport"));
const user_model_1 = require("../user/user.model");
const env_1 = require("../../config/env");
const user_interface_1 = require("../user/user.interface");
// Only configure Google strategy if credentials are available
if (env_1.envVars.GOOGLE_CLIENT_ID &&
    env_1.envVars.GOOGLE_CLIENT_SECRET &&
    env_1.envVars.GOOGLE_CALLBACK_URL) {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: env_1.envVars.GOOGLE_CLIENT_ID,
        clientSecret: env_1.envVars.GOOGLE_CLIENT_SECRET,
        callbackURL: env_1.envVars.GOOGLE_CALLBACK_URL,
    }, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        try {
            const email = (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
            const name = profile.displayName;
            const picture = (_d = (_c = profile.photos) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value;
            // Check if user already exists
            let user = yield user_model_1.User.findOne({ email });
            if (user) {
                // Check if Google auth is already linked
                const googleAuth = (_e = user.auths) === null || _e === void 0 ? void 0 : _e.find((auth) => auth.provider === "google");
                if (!googleAuth) {
                    // Add Google authentication to existing user
                    user.auths = user.auths || [];
                    user.auths.push({
                        provider: "google",
                        id: profile.id,
                        providerID: profile.id,
                    });
                    yield user.save();
                }
            }
            else {
                // Create new user
                user = yield user_model_1.User.create({
                    name,
                    email,
                    picture,
                    role: user_interface_1.Role.SENDER, // Default role
                    auths: [
                        {
                            provider: "google",
                            id: profile.id,
                            providerID: profile.id,
                        },
                    ],
                });
            }
            return done(null, user);
        }
        catch (error) {
            return done(error, undefined);
        }
    })));
}
else {
    // eslint-disable-next-line no-console
    console.warn("Google OAuth credentials not configured. Google login will be unavailable.");
}
// Serialize user for session
passport_1.default.serializeUser((user, done) => {
    const userObj = user;
    done(null, userObj._id);
});
// Deserialize user from session
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
}));
exports.default = passport_1.default;
