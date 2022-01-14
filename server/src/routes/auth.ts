import express, { Request, Response } from "express";
import argon2 from "argon2";

import User from "../models/User";
import { createToken } from "../utils/jwt";
import { setCookie } from "../utils/cookie";
import { authenticate } from "../utils/middlewares";
import { AuthRequest } from "../types";

const router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      res.status(403).send("wrong email or password");
      return;
    }

    const isValid = await argon2.verify(user.password, password);
    if (!isValid) {
      res.status(403).send("wrong email or password");
      return;
    }

    const token = createToken({ id: user.id }, "1h");

    setCookie(res, token);

    res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);

    res.status(500).send("Internal server error");
  }
});

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;
    const hashedPassword = await argon2.hash(password);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    const token = createToken({ id: user.id }, "1h");

    setCookie(res, token);

    res.status(200).json({ status: "success" });
  } catch (err) {
    console.log(err);

    if (err.code === 11000) {
      res.status(200).json({
        status: "failed",
        field: err.keyPattern.hasOwnProperty("email") ? "email" : "username",
      });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/me", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId).populate(
      "fr.user friends.user",
      "_id username"
    );
    const { _id, username, fr, friends } = user._doc;
    /*const socket = io?.sockets.sockets.get(getSocket(userId!));
    if (socket) {
      friends.forEach(({ channel }: { channel: mongoose.Types.ObjectId }) => {
        socket.join(channel.toString());
      });
    }*/
    res.status(200).json({ _id, username, fr, friends });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
