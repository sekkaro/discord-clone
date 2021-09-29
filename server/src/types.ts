import { Request } from "express";

export type AuthRequest = Request & {
  userId?: string;
};

export type User = {
  [userId: string]: {
    socketId: string;
  };
};
