import { Pair } from "../types";

let users: Pair = {};
let sockets: Pair = {};

export const addUser = (userId: string, socketId: string) => {
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
