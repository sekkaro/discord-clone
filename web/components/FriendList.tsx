import React from "react";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { CheckIcon, CloseIcon, ChatIcon } from "@chakra-ui/icons";

import { FrType } from "../types";

const Request = ({ r, acceptFriendRequest, cancelFriendRequest }: any) => (
  <>
    <Box
      mt={2}
      mb={2}
      borderBottomWidth={0.5}
      borderBottomColor="oslogray"
    ></Box>
    <Flex justifyContent="space-between">
      <Box>
        <Text color="white" fontWeight={700}>
          {r.user.username}
        </Text>
        <Text color="#cccccc" fontSize={12}>
          {r.type === FrType.IN ? "Incoming " : "Outgoing "}
          Friend Request
        </Text>
      </Box>
      <Flex>
        {r.type === FrType.IN && (
          <Button
            onClick={() => acceptFriendRequest(r._id, r.user._id)}
            bgColor="outerspace"
            _hover={{
              bgColor: "gondola",
            }}
            _active={{
              bgColor: "outerspace",
            }}
            _focus={{
              boxShadow: "none",
              bgColor: "gondola",
            }}
            w={4}
            borderRadius={50}
          >
            <CheckIcon color="#cccccc" w={3} h={3} />
          </Button>
        )}
        <Button
          onClick={() => cancelFriendRequest(r._id, r.type, r.user._id)}
          ml={3}
          bgColor="outerspace"
          _hover={{
            bgColor: "gondola",
          }}
          _active={{
            bgColor: "outerspace",
          }}
          _focus={{
            boxShadow: "none",
            bgColor: "gondola",
          }}
          w={4}
          borderRadius={50}
        >
          <CloseIcon color="#cccccc" w={3} h={3} />
        </Button>
      </Flex>
    </Flex>
  </>
);

const Friend = ({ r }: any) => (
  <>
    <Box
      mt={2}
      mb={2}
      borderBottomWidth="thin"
      borderBottomColor="#474747"
    ></Box>
    <Flex justifyContent="space-between">
      <Box>
        <Text color="white" fontWeight={700}>
          {r.username}
        </Text>
      </Box>
      <Flex>
        <Button
          onClick={() => {}}
          bgColor="outerspace"
          _hover={{
            bgColor: "gondola",
          }}
          _active={{
            bgColor: "outerspace",
          }}
          _focus={{
            boxShadow: "none",
            bgColor: "gondola",
          }}
          w={4}
          borderRadius={50}
        >
          <ChatIcon color="#cccccc" w={3} h={3} />
        </Button>
      </Flex>
    </Flex>
  </>
);

const FriendList = ({
  data,
  type,
  acceptFriendRequest,
  cancelFriendRequest,
}: any) => (
  <>
    {data.length > 0 ? (
      <Box>
        <Text color="#cccccc" fontSize={12} fontWeight={700}>
          {type === "all" ? "ALL FRIENDS" : `PENDING - ${data.length}`}
        </Text>
        {data.map((r: any) => {
          return type === "all" ? (
            <Friend key={r._id} r={r.user} />
          ) : (
            <Request
              key={r._id}
              r={r}
              acceptFriendRequest={acceptFriendRequest}
              cancelFriendRequest={cancelFriendRequest}
            />
          );
        })}
      </Box>
    ) : (
      <Text>
        {type === "all"
          ? "You have no friends"
          : "There are no pending friend requests"}
      </Text>
    )}
  </>
);

export default FriendList;
