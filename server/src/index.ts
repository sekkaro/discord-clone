import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import cookie from "cookie";
import jwt from "jsonwebtoken";

import authRoute from "./routes/auth";
import frRoute from "./routes/fr";
import { addUser, getUserId } from "./utils/users";
import { AuthRequest } from "./types";
import User from "./models/User";

const main = () => {
  const app = express();
  mongoose.connect(process.env.MONGO_URL as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  app.use(express.json());
  app.use(
    cors({
      credentials: true,
      origin: process.env.CLIENT_URL,
    })
  );
  app.use(cookieParser());

  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
    },
  });

  app.use((req: AuthRequest, _, next) => {
    req.io = io;
    next();
  });

  app.use("/api/auth", authRoute);
  app.use("/api/fr", frRoute);

  io.use((socket, next) => {
    if (!socket.handshake.headers.cookie) {
      socket.disconnect();
      return;
    }

    const decoded: any = jwt.verify(
      cookie.parse(socket.handshake.headers.cookie)["token"],
      process.env.JWT_SECRET as string
    );

    if (!decoded.id) {
      socket.disconnect();
      return;
    }

    addUser(decoded.id, socket.id);

    next();
  });

  io.on("connection", (socket) => {
    console.log("new web socket connection");

    const userId = getUserId(socket.id);
    if (userId) {
      User.findById(userId, (_, user) => {
        if (user) {
          const { friends } = user;
          friends.forEach(
            ({ channel }: { channel: mongoose.Types.ObjectId }) => {
              socket.join(channel.toString());
            }
          );
        }
      });
    }

    socket.on("sendMessage", ({ channelId, message, username }, callback) => {
      socket.broadcast
        .to(channelId)
        .emit("message", { channelId, message, username });
      callback();
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });
  });

  const port = process.env.PORT || 5050;

  server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
  });
};

main();
