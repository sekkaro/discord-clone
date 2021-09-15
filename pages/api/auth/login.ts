import { NextApiHandler } from "next";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

import User from "../../../models/User";
import dbConnect from "../../../utils/dbConnect";

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  await dbConnect();
  switch (method) {
    case "POST":
      try {
        const { email, password } = req.body;
        const user = await User.findOne({
          email,
        });

        if (!user) {
          return res.status(403).send("wrong email or password");
        }

        const isValid = await argon2.verify(user.password, password);
        if (!isValid) {
          return res.status(403).send("wrong email or password");
        }

        const token = jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET as string,
          { expiresIn: "1h" }
        );

        res.status(200).json({ token });
      } catch (err: any) {
        console.log(err);

        res.status(500).send("Internal server error");
      }
      break;
    default:
      res.status(405).json({ message: "We only support POST" });
      break;
  }
};

export default handler;
