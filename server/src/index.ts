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
import User from "./models/User";
import { addUser, getSocket } from "./utils/users";

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

  app.use("/api/auth", authRoute);
  app.use("/api/fr", frRoute);

  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
    },
  });

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

    // socket.on("init", async (userId, callback) => {
    //   await User.findByIdAndUpdate(
    //     userId,
    //     { socketId: socket.id },
    //     { new: true }
    //   );

    //   callback();
    // });

    socket.on("sendFr", ({ username, id }, callback) => {
      User.findOne({ username }, async (_, user) => {
        if (!user) {
          return callback("user not found");
        }
        const { _id } = user;

        const socketId = getSocket(_id);

        if (_id.toString() === id) {
          return callback("cannot send fr to yourself");
        }

        const fr: Array<any> = user.fr ? user.fr : [];

        if (!fr.find(({ user }) => user.toString() === id)) {
          fr.push({
            user: mongoose.Types.ObjectId(id),
            type: "in",
          });
          user.fr = fr;
          await user.save();
          socket.broadcast.to(socketId).emit("fr");
        }

        callback();
      });
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
