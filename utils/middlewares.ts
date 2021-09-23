import { NextApiHandler, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

import User from "../models/User";
import { Request } from "../types";

export const authenticated =
  (fn: NextApiHandler) => async (req: Request, res: NextApiResponse) => {
    const token = req.cookies.token;

    if (!token) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!decoded.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const user = User.findById(decoded.id);
    if (!user) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.userId = decoded.id;

    return await fn(req, res);
  };
