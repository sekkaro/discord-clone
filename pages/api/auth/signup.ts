import { NextApiHandler } from "next";
import argon2 from "argon2";

import User from "../../../models/User";
import dbConnect from "../../../utils/dbConnect";

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  await dbConnect();
  switch (method) {
    case "POST":
      try {
        const { email, password, username } = req.body;
        const hashedPassword = await argon2.hash(password);
        const user = await User.create({
          email,
          username,
          password: hashedPassword,
        });
        res.status(200).json({ message: "success" });
      } catch (err: any) {
        console.log(err);

        if (err.code === 11000) {
          return res.status(500).send("Duplicate email");
        }

        res.status(500).send("Internal server error");
      }
      //   try {
      //     const pet = await Pet.create(
      //       req.body
      //     ); /* create a new model in the database */
      //     res.status(201).json({ success: true, data: pet });
      //   } catch (error) {
      //     res.status(400).json({ success: false });
      //   }
      break;
    default:
      res.status(405).json({ message: "We only support POST" });
      break;
  }
};

export default handler;
