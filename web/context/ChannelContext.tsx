import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { Message, Messages } from "../types";
import { socket } from "../utils/socket";

export interface ChannelContext {
  // getMessages: (channelId: string) => Message;
  messages: Messages;
}

const ChannelContext = createContext<ChannelContext>(null!);

export const useChannel = () => {
  return useContext(ChannelContext);
};

export const ChannelProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Messages>({});

  useEffect(() => {
    socket.on("message", async ({ channelId, message, username }) => {
      setMessages((messages) => {
        const newMsg = { text: message, username };
        return messages[channelId]
          ? {
              ...messages,
              [channelId]: [...messages[channelId], newMsg],
            }
          : { ...messages, [channelId]: [newMsg] };
      });
    });

    return () => {
      socket.off("message");
    };
  }, []);

  // const getMessages = useCallback(
  //   (channelId: string) => messages[channelId],
  //   [messages]
  // );

  return (
    <ChannelContext.Provider
      value={{
        messages,
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
};

export default ChannelContext;
