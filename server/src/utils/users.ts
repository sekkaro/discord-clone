import { User } from "../types";

let users: User = {};

export const addUser = (userId: string, socketId: string) => {
  users = {
    ...users,
    [userId]: {
      socketId,
    },
  };
};

export const getSocket = (userId: string) => users[userId].socketId;
