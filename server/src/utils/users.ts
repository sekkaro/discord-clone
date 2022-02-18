import { Server } from "socket.io";
import { Pair } from "../types";

let users: Pair = {};
let sockets: Pair = {};

export const addUser = (userId: string, socketId: string, io: Server) => {
  const prevSocket = getSocketId(userId);
  if (prevSocket) {
    io.sockets.sockets.get(prevSocket)?.disconnect();
  }
  users = {
    ...users,
    [userId]: socketId,
  };
  sockets = {
    ...sockets,
    [socketId]: userId,
  };
};

export const getSocketId = (userId: string) => users[userId];

export const getUserId = (socketId: string) => sockets[socketId];
