import express, { Response } from "express";
import mongoose from "mongoose";

import { AuthRequest, FrType } from "../types";
import { authenticate } from "../utils/middlewares";
import User from "../models/User";
import { getSocket } from "../utils/users";
import { notifyFrSender } from "../utils/notifyFrSender";
import { createChannel } from "../utils/createChannel";

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
      const {
        body: { senderId },
        userId,
        io,
      } = req;

      const channelId = await createChannel([userId, senderId]);

      const user = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            friends: {
              user: senderId,
              channel: channelId,
            },
          },
          $pull: {
            fr: {
              _id: frId,
            },
          },
        },
        { new: true }
      ).populate("fr.user friends.user", "_id username");

      const { error } = await notifyFrSender(
        senderId,
        userId as string,
        true,
        io,
        channelId
      );

      if (error) {
        res
          .status(error.status ? error.status : 500)
          .json({ message: error.message });
        return;
      }

      const { fr, friends } = user._doc;

      res.status(200).json({ fr, friends });
    } catch (err) {
      console.log(err);

      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/:id/reject",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const frId = req.params.id;
      const {
        body: { senderId, type },
        userId,
        io,
      } = req;

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

      if (type === FrType.OUT) {
        const { error } = await notifyFrSender(
          senderId,
          userId as string,
          false,
          io
        );

        if (error) {
          res
            .status(error.status ? error.status : 500)
            .json({ message: error.message });
          return;
        }
      }

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

    let {
      _id,
      fr,
      friends,
    }: { fr: Array<any>; _id: string; friends: Array<any> } = target._doc;

    if (_id.toString() === userId) {
      res.status(409).json({ message: "cannot send fr to yourself" });
      return;
    }

    const socketId = getSocket(_id);

    const isDuplicate = fr.find(({ user }) => user.toString() === userId);
    const isFriend = friends.find(({ user }) => user.toString() === userId);

    if (isFriend) {
      res.status(409).json({ message: "already friends with that user" });
      return;
    }

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
