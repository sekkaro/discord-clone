import { NextApiHandler } from "next";

import User from "../../models/User";
import dbConnect from "../../utils/dbConnect";
import { authenticated } from "../../utils/middlewares";

const handler: NextApiHandler = authenticated(async (req, res) => {
  const { method } = req;
  await dbConnect();
  switch (method) {
    case "GET":
      try {
        const users = await User.find();
        res.status(200).json({ users });
      } catch (err: any) {
        console.log(err);

        res.status(500).send("Internal server error");
      }
      break;
    default:
      res.status(405).json({ message: "We only support POST" });
      break;
  }
});

export default handler;
