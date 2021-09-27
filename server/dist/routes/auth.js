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
const express_1 = __importDefault(require("express"));
const argon2_1 = __importDefault(require("argon2"));
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../utils/jwt");
const cookie_1 = require("../utils/cookie");
const middlewares_1 = require("../utils/middlewares");
const router = express_1.default.Router();
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({
            email,
        });
        if (!user) {
            res.status(403).send("wrong email or password");
            return;
        }
        const isValid = yield argon2_1.default.verify(user.password, password);
        if (!isValid) {
            res.status(403).send("wrong email or password");
            return;
        }
        const token = (0, jwt_1.createToken)({ id: user.id }, "1h");
        (0, cookie_1.setCookie)(res, token);
        res.status(200).json({ message: "success" });
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Internal server error");
    }
}));
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, username } = req.body;
        const hashedPassword = yield argon2_1.default.hash(password);
        const user = yield User_1.default.create({
            email,
            username,
            password: hashedPassword,
        });
        const token = (0, jwt_1.createToken)({ id: user.id }, "1h");
        (0, cookie_1.setCookie)(res, token);
        res.status(200).json({ status: "success" });
    }
    catch (err) {
        console.log(err);
        if (err.code === 11000) {
            res
                .status(200)
                .json({ status: "failed", message: "Email is already registered" });
            return;
        }
        res.status(500).send("Internal server error");
    }
}));
router.get("/me", middlewares_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.userId);
        const { _id, username, fr } = user._doc;
        res.status(200).json({ _id, username, fr });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.default = router;
//# sourceMappingURL=auth.js.map