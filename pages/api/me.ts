import { NextApiHandler } from "next";

import User from "../../models/User";
import { Request } from "../../types";
import dbConnect from "../../utils/dbConnect";
import { authenticated } from "../../utils/middlewares";

const handler: NextApiHandler = authenticated(async (req: Request, res) => {
  const { method } = req;
  await dbConnect();
  switch (method) {
    case "GET":
      try {
        const user = await User.findById(req.userId);
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others });
      } catch (err: any) {
        console.log(err);

        res.status(500).json({ message: "Internal server error" });
      }
      break;
    default:
      res.status(405).json({ message: "We only support GET" });
      break;
  }
});

export default handler;
