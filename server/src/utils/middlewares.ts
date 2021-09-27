import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types";

import User from "../models/User";

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies["token"];

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
  if (!decoded.id) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
  const user = User.findById(decoded.id);
  if (!user) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  req.userId = decoded.id;

  next();
};
