import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { Message, Messages, StatusType } from "../types";
import { socket } from "../utils/socket";

export interface ChannelContext {
  // getMessages: (channelId: string) => Message;
  messages: Messages;
  addMessages: ({
    channelId,
    message,
    username,
    status,
  }: {
    channelId: string;
    message: string;
    username: string;
    status?: StatusType | undefined;
  }) => number;
  changeStatus: (channelId: string, idx: number, status: StatusType) => void;
  setCurrentChannel: (currentChannel: string) => void;
  unseenCount: {
    [channelId: string]: number;
  };
}

const ChannelContext = createContext<ChannelContext>(null!);

export const useChannel = () => {
  return useContext(ChannelContext);
};

export const ChannelProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Messages>({});
  const [unseenCount, setUnseenCount] = useState<{
    [channelId: string]: number;
  }>({});
  const [currentChannel, setCurrentChannel] = useState<string>("");

  useEffect(() => {
    socket.on("message", addMessages);
    if (unseenCount[currentChannel] && unseenCount[currentChannel] > 0) {
      setUnseenCount((channels) => {
        return { ...channels, [currentChannel]: 0 };
      });
    }
    return () => {
      socket.off("message");
    };
  }, [currentChannel]);

  const addMessages = ({
    channelId,
    message,
    username,
    status,
  }: {
    channelId: string;
    message: string;
    username: string;
    status?: StatusType;
  }) => {
    setUnseenCount((channels) => {
      if (channelId === currentChannel) {
        return {
          ...channels,
          [channelId]: 0,
        };
      }

      const unseenCount = channels[channelId] ? channels[channelId] + 1 : 1;
      return {
        ...channels,
        [channelId]: unseenCount,
      };
    });

    setMessages((messages) => {
      const newMsg = {
        text: message,
        username,
        status: status ? status : StatusType.SUCCESS,
      };
      return messages[channelId]
        ? {
            ...messages,
            [channelId]: [...messages[channelId], newMsg],
          }
        : { ...messages, [channelId]: [newMsg] };
    });

    return messages[channelId] ? messages[channelId].length : 0;
  };

  const changeStatus = (channelId: string, idx: number, status: StatusType) => {
    setMessages((messages) => {
      const channelMessages = messages[channelId];
      channelMessages[idx].status = status;
      return {
        ...messages,
        [channelId]: channelMessages,
      };
    });
  };

  // const getMessages = useCallback(
  //   (channelId: string) => messages[channelId],
  //   [messages]
  // );

  return (
    <ChannelContext.Provider
      value={{
        messages,
        addMessages,
        changeStatus,
        setCurrentChannel,
        unseenCount,
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
};

export default ChannelContext;
