import { io } from "socket.io-client";

export const socket = io(process.env.API_URI as string, {
  transports: ["websocket"],
  upgrade: false,
  withCredentials: true,
});
