import express, { Response } from "express";

import { AuthRequest } from "../types";
import { authenticate } from "../utils/middlewares";
import User from "../models/User";

const router = express.Router();

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).populate(
      "fr.user",
      "username"
    );
    const { fr } = user._doc;
    res.status(200).json({ fr });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Internal server error" });
  }
});

router.get(
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
      ).populate("fr.user", "username");

      const { fr } = user._doc;

      res.status(200).json({ fr });
    } catch (err) {
      console.log(err);

      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
