import { Mongoose } from "mongoose";

export type Global = typeof globalThis & {
  mongoose: { conn: Mongoose | null; promise: Promise<Mongoose> | null };
};
