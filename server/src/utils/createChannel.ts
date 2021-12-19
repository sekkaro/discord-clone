import Channel from "../models/Channel";

export const createChannel = async (users: Array<any>) => {
  const channel = await Channel.create({ users });
  return channel.id;
};
