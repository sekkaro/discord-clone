import express, { Response } from "express";
import mongoose from "mongoose";

import { AuthRequest } from "../types";
import { authenticate } from "../utils/middlewares";
import User from "../models/User";
import { getSocket } from "../utils/users";

const router = express.Router();

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).populate(
      "fr.user",
      "_id username"
    );
    const { fr } = user._doc;
    res.status(200).json({ fr });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(
  "/:id/accept",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const frId = req.params.id;
      const { userId } = req.body;

      const user = await User.findByIdAndUpdate(
        req.userId,
        {
          $push: {
            friends: userId,
          },
          $pull: {
            fr: {
              _id: frId,
            },
          },
        },
        { new: true }
      ).populate("fr.user friends", "_id username");

      const { fr, friends } = user._doc;

      res.status(200).json({ fr, friends });
    } catch (err) {
      console.log(err);

      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.delete(
  "/:id/reject",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const frId = req.params.id;

      const user = await User.findByIdAndUpdate(
        req.userId,
        {
          $pull: {
            fr: {
              _id: frId,
            },
          },
        },
        { new: true }
      ).populate("fr.user", "_id username");

      const { fr } = user._doc;

      res.status(200).json({ fr });
    } catch (err) {
      console.log(err);

      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const {
      userId,
      body: { username },
      io,
    } = req;

    const target = await User.findOne({ username });

    if (!target) {
      res.status(404).json({ message: "user not found" });
      return;
    }

    let { _id, fr }: { fr: Array<any>; _id: string } = target._doc;

    if (_id.toString() === userId) {
      res.status(409).json({ message: "cannot send fr to yourself" });
      return;
    }

    const socketId = getSocket(_id);

    const isDuplicate = fr.find(({ user }) => user.toString() === userId);

    if (!isDuplicate) {
      fr.push({
        user: mongoose.Types.ObjectId(userId),
        type: "in",
      });
      target.fr = fr;
      await target.save();
      if (socketId) {
        io?.sockets.to(socketId).emit("user");
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      isDuplicate
        ? {}
        : {
            $push: {
              fr: {
                user: _id,
                type: "out",
              },
            },
          },
      { new: true }
    ).populate("fr.user", "_id username");

    fr = user._doc.fr;

    res.status(200).json({ fr });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
