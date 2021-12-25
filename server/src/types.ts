import { Request } from "express";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export type AuthRequest = Request & {
  userId?: string;
  io?: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>;
  name?: string;
};

export type User = {
  [userId: string]: {
    socketId: string;
  };
};

export type Fr = {
  user: {
    _id: string;
  };
};

export type Error = {
  message: string;
  status?: number;
};

export enum FrType {
  IN = "in",
  OUT = "out",
}
