import { Request } from "express";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export type AuthRequest = Request & {
  userId?: string;
  io?: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>;
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
