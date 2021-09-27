"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const authenticate = (req, res, next) => {
    const token = req.cookies["token"];
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) {
        res.status(403).json({ message: "Forbidden" });
        return;
    }
    const user = User_1.default.findById(decoded.id);
    if (!user) {
        res.status(403).json({ message: "Forbidden" });
        return;
    }
    req.userId = decoded.id;
    next();
};
exports.authenticate = authenticate;
//# sourceMappingURL=middlewares.js.map