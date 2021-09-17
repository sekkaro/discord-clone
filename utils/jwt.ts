import jwt from "jsonwebtoken";

export const createToken = (payload: any, expiresIn: string) =>
  jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn });
