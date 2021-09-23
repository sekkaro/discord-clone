import { Mongoose } from "mongoose";
import { NextApiRequest } from "next";

export type Global = typeof globalThis & {
  mongoose: { conn: Mongoose | null; promise: Promise<Mongoose> | null };
};

export type Request = NextApiRequest & {
  userId?: string;
};

export type PageProps = {
  user?: {
    username: string;
    email: string;
    password: string;
  };
};
