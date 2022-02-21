import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import User from "../models/User";
import { Error, FrType } from "../types";
import { getSocketId } from "./users";

export const notifyFrSender = async (
  senderId: string,
  userId: string,
  isAccept: Boolean,
  io?: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>,
  channelId?: string
): Promise<{ error?: Error }> => {
  const user = await User.findById(senderId).populate(
    "fr.user friends.user",
    "_id username"
  );

  if (!user) {
    return {
      error: {
        message: "user not found",
        status: 404,
      },
    };
  }

  let {
    fr,
    _id,
    friends,
  }: { fr: Array<any>; _id: string; friends: Array<any> } = user._doc;

  const socketId = getSocketId(_id);

  const idx = fr.findIndex(({ user, type }) =>
    user.toString() === userId && type === isAccept ? FrType.OUT : FrType.IN
  );

  if (isAccept) {
    const updatedUser = await User.findByIdAndUpdate(
      senderId,
      {
        $push: {
          friends: {
            user: userId,
            channel: channelId,
          },
        },
      },
      { new: true }
    ).populate("friends.user", "_id username");

    friends = updatedUser._doc.friends;
  }

  if (idx >= 0) {
    fr.splice(idx, 1);
    user.fr = fr;
    await user.save();
    if (socketId) {
      if (isAccept) {
        io?.sockets.to(socketId).emit("updateFriends", friends);
        io?.sockets.sockets.get(socketId)?.join(channelId!);
      }
      io?.sockets.to(socketId).emit("updateFr", fr);
    }
  }

  return {};
};
