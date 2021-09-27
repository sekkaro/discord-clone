"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        minLength: 8,
        maxLength: 100,
        required: true,
    },
    socketId: {
        type: String,
    },
    fr: [
        {
            user: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "User",
            },
            type: {
                type: String,
                enum: ["in", "out"],
            },
        },
    ],
}, { timestamps: true });
exports.default = mongoose_1.default.models.User || mongoose_1.default.model("User", UserSchema);
//# sourceMappingURL=User.js.map