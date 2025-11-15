"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalerrorhandaler = void 0;
const globalerrorhandaler = (err, req, res, next) => {
    res.status(500).json({
        success: false,
        message: `Something went wrong: ${err.message}`,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};
exports.globalerrorhandaler = globalerrorhandaler;
