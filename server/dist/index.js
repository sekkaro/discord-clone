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
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const User_1 = __importDefault(require("./models/User"));
const main = () => {
    const app = (0, express_1.default)();
    mongoose_1.default.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    });
    app.use(express_1.default.json());
    app.use((0, cors_1.default)({
        credentials: true,
        origin: process.env.CLIENT_URL,
    }));
    app.use((0, cookie_parser_1.default)());
    app.use("/api/auth", auth_1.default);
    const server = (0, http_1.createServer)(app);
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
        },
    });
    io.on("connection", (socket) => {
        console.log("new web socket connection");
        socket.on("init", (userId) => __awaiter(void 0, void 0, void 0, function* () {
            yield User_1.default.findByIdAndUpdate(userId, { socketId: socket.id }, { new: true });
        }));
        socket.on("sendFr", ({ username, id }, callback) => {
            User_1.default.findOne({ username }, (_, user) => __awaiter(void 0, void 0, void 0, function* () {
                if (!user) {
                    return callback("user not found");
                }
                const { _id, socketId } = user;
                if (_id.toString() === id) {
                    return callback("cannot send fr to yourself");
                }
                const fr = user.fr ? user.fr : [];
                if (!fr.find(({ user }) => user.toString() === id)) {
                    fr.push({
                        user: mongoose_1.default.Types.ObjectId(id),
                        type: "in",
                    });
                    user.fr = fr;
                    yield user.save();
                }
                socket.broadcast.to(socketId).emit("fr");
                callback();
            }));
        });
        socket.on("disconnect", () => {
            console.log("disconnected");
        });
    });
    const port = process.env.PORT || 3001;
    server.listen(port, () => {
        console.log(`Server is up on port ${port}`);
    });
};
main();
//# sourceMappingURL=index.js.map