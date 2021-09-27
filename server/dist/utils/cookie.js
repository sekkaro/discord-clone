"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookie = void 0;
const setCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600 * 1000,
        domain: process.env.BASE_DOMAIN,
        path: "/",
    });
};
exports.setCookie = setCookie;
//# sourceMappingURL=cookie.js.map