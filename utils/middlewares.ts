import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

import User from "../models/User";

export const authenticated =
  (fn: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(403).send("Forbidden");
    }
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!decoded.id) {
      return res.status(403).send("Forbidden");
    }
    const user = User.findById(decoded.id);
    if (!user) {
      return res.status(403).send("Forbidden");
    }
    return await fn(req, res);
  };
