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
      res
        .status(200)
        .json({ status: "failed", message: "Email is already registered" });
      return;
    }
    res.status(500).send("Internal server error");
  }
});

router.get("/me", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    const { _id, username, fr } = user._doc;
    res.status(200).json({ _id, username, fr });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;