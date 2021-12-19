import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import User from "../models/User";
import { Error, FrType } from "../types";
import { getSocket } from "./users";

export const notifyFrSender = async (
  senderId: string,
  userId: string,
  isAccept: Boolean,
  io?: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>,
  channelId?: string
): Promise<{ error?: Error }> => {
  const user = await User.findById(senderId);

  if (!user) {
    return {
      error: {
        message: "user not found",
        status: 404,
      },
    };
  }

  const { fr, _id }: { fr: Array<any>; _id: string } = user._doc;

  const socketId = getSocket(_id);

  const idx = fr.findIndex(({ user, type }) =>
    user.toString() === userId && type === isAccept ? FrType.OUT : FrType.IN
  );

  if (isAccept) {
    await User.findByIdAndUpdate(senderId, {
      $push: {
        friends: {
          user: userId,
          channel: channelId,
        },
      },
    });
  }

  if (idx >= 0) {
    fr.splice(idx, 1);
    user.fr = fr;
    await user.save();
    if (socketId) {
      io?.sockets.to(socketId).emit("user");
    }
  }

  return {};
};
