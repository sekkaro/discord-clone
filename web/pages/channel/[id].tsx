import { useEffect, useRef, useState } from "react";
import { Flex, Text, Input, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { useUser } from "../../context/UserContext";
import { socket } from "../../utils/socket";
import { useChannel } from "../../context/ChannelContext";
import { StatusType } from "../../types";

const Channel = () => {
  const router = useRouter();
  const { friend, username } = useUser();
  const { messages, addMessages, changeStatus } = useChannel();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const channelId = router.query.id as string;
  const channelMessages = messages[channelId];

  useEffect(() => {
    scrollToBottom();
  }, [channelMessages]);

  const sendMessage = () => {
    const msg = {
      channelId,
      message,
      username: username as string,
      status: StatusType.PENDING,
    };
    setMessage("");
    const idx = addMessages(msg);
    socket.emit("sendMessage", msg, async (err: string) => {
      if (!err) {
        changeStatus(msg.channelId, idx, StatusType.SUCCESS);
      } else {
        console.log(err);
        changeStatus(msg.channelId, idx, StatusType.ERROR);
      }
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  return (
    <>
      <Flex
        height={50}
        pt={1}
        pb={1}
        alignItems="center"
        borderBottom="1px solid #2b2d32"
      >
        <Text ml={5} color="white" fontWeight={500}>
          {friend?.username}
        </Text>
      </Flex>
      <Box display="flex" flexDir="column" ml={5} height="92vh">
        <Box
          overflowY="auto"
          mr={1}
          css={{
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#2e3338",
              width: "8px",
              marginTop: "5px",
              marginBottom: "5px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#202225",
              borderRadius: "50px",
            },
          }}
          flex={20}
          justifyContent="flex-end"
        >
          {channelMessages?.map(({ text, username, status }, idx) => (
            <Box pt={1} pb={1} key={idx}>
              <Text color="#ffffff" fontSize={15}>
                {username}
              </Text>
              <Text
                color={
                  status === StatusType.SUCCESS
                    ? "#dcddde"
                    : status === StatusType.PENDING
                    ? "shadow2"
                    : "red"
                }
                fontSize={15}
              >
                {text}
              </Text>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>
        <Box flex={1} mr={5}>
          <Input
            p={5}
            justifySelf="flex-end"
            bgColor="shadow2"
            borderWidth={0}
            textColor="white"
            fontSize={15}
            _focus={{
              outline: "none",
            }}
            _placeholder={{
              textColor: "gray",
            }}
            placeholder={`Message ${friend?.username}`}
            autoFocus
            value={message}
            onChange={(e) => setMessage(e.currentTarget.value)}
            onKeyDown={(e) => e.code === "Enter" && message && sendMessage()}
          />
        </Box>
      </Box>
    </>
  );
};

export default Channel;
