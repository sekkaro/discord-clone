import { Box, Flex, Text } from "@chakra-ui/layout";
import type { NextPage } from "next";
import React, {
  LegacyRef,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import "@fontsource/open-sans";
import { Button } from "@chakra-ui/button";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { FormControl } from "@chakra-ui/form-control";

import {
  cancelFriendRequest as cancelFriendRequestAPI,
  sendFriendRequest as sendFriendRequestAPI,
  acceptFriendRequest as acceptFriendRequestAPI,
} from "../api/fr";
import FriendList from "../components/FriendList";
import { useUser } from "../context/UserContext";
import NotificationNumber from "../components/NotificationNumber";

const Home: NextPage = () => {
  const { setFr, setFriends, fr, friends, pending } = useUser();

  const [buttonState, setButtonState] = useState("all");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const inputRef = useRef() as LegacyRef<HTMLInputElement>;

  useEffect(() => {
    if (buttonState !== "add") {
      setSuccess("");
      setError("");
      setUsername("");
    } else {
      (inputRef as MutableRefObject<HTMLInputElement>).current?.focus();
    }
  }, [buttonState]);

  const sendFriendRequest = async () => {
    const { message, fr } = await sendFriendRequestAPI(username);
    if (!fr) {
      console.log(message);
      setError(
        "Hm, didn't work. Double check that the capitalization, spelling, any spaces, and numbers are correct."
      );
      setSuccess("");
      return;
    }

    setSuccess(`Success! Your friend request to ${username} was sent`);
    setUsername("");
    setError("");
    setFr(fr);
  };

  const cancelFriendRequest = async (
    id: string,
    type: string,
    senderId: string
  ) => {
    const fr = await cancelFriendRequestAPI(id, type, senderId);
    if (!fr) {
      // oops try again
      return;
    }
    setFr(fr);
  };

  const acceptFriendRequest = async (id: string, senderId: string) => {
    const { fr, friends, message } = await acceptFriendRequestAPI(id, senderId);
    if (message) {
      // oops try again
      return;
    }
    setFr(fr);
    setFriends(friends);
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
          Friends
        </Text>
        <Button
          color="#c2c2c2"
          fontWeight={400}
          ml={6}
          bgColor="tuna"
          p={2}
          height={30}
          fontSize={14}
          _hover={{
            bgColor: "shadow",
            textColor: "white",
          }}
          _active={{
            bgColor: "shadow",
            textColor: "white",
          }}
          _focus={{
            bgColor: "shadow",
            textColor: "white",
          }}
          isActive={buttonState === "all"}
          onClick={() => setButtonState("all")}
        >
          All
        </Button>
        <Button
          color="#c2c2c2"
          fontWeight={400}
          fontSize={14}
          ml={6}
          p={2}
          height={30}
          bgColor="tuna"
          _hover={{
            bgColor: "shadow",
            textColor: "white",
          }}
          _active={{
            bgColor: "shadow",
            textColor: "white",
          }}
          _focus={{
            boxShadow: "none",
            bgColor: "shadow",
            textColor: "white",
          }}
          isActive={buttonState === "pending"}
          onClick={() => setButtonState("pending")}
        >
          Pending
          {pending > 0 && <NotificationNumber number={pending} />}
        </Button>
        <Button
          color="white"
          fontWeight={500}
          fontSize={14}
          ml={6}
          p={2}
          height={30}
          bgColor="green"
          _hover={{
            bgColor: "none",
            textColor: "white",
          }}
          _active={{
            bgColor: "transparent",
            textColor: "green",
          }}
          _focus={{
            boxShadow: "none",
            bgColor: "transparent",
            textColor: "green",
          }}
          isActive={buttonState === "add"}
          onClick={() => setButtonState("add")}
        >
          Add Friend
        </Button>
      </Flex>
      <Box p={4}>
        {buttonState === "all" ? (
          <FriendList data={friends} type={buttonState} />
        ) : buttonState === "pending" ? (
          <FriendList
            data={fr}
            type={buttonState}
            acceptFriendRequest={acceptFriendRequest}
            cancelFriendRequest={cancelFriendRequest}
          />
        ) : (
          <>
            <Text color="white" fontWeight={500}>
              ADD FRIEND
            </Text>
            <Text color="#cccccc" fontSize={14}>
              You can add a friend with their username. It's cAsE sEnSitIvE!
            </Text>
            <FormControl mt={4} id="username">
              <InputGroup width="60%">
                <Input
                  p={6}
                  placeholder="Enter a Username"
                  _placeholder={{
                    color: "oslogray",
                  }}
                  borderColor={success ? "green" : "black"}
                  backgroundColor="#292b29"
                  _hover={{
                    borderColor: success ? "green" : "black",
                  }}
                  color="#cccccc"
                  fontWeight={500}
                  fontSize={16}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  _invalid={{
                    borderColor: "red",
                  }}
                  _valid={{
                    borderColor: "green",
                  }}
                  _focus={{
                    borderColor: success
                      ? "green"
                      : error
                      ? "red"
                      : "rgb(66, 153, 225)",
                  }}
                  value={username}
                  isInvalid={!!error}
                  ref={inputRef}
                  onKeyDown={(e) => e.code === "Enter" && sendFriendRequest()}
                />
                <InputRightElement
                  mt={1}
                  mr={2}
                  width="150px"
                  children={
                    <Button
                      color="white"
                      bgColor="cornflowerblue"
                      fontWeight={500}
                      fontSize={13}
                      height="70%"
                      borderRadius={2}
                      isDisabled={!username}
                      onClick={sendFriendRequest}
                    >
                      Send Friend Request
                    </Button>
                  }
                />
              </InputGroup>
              {error ? (
                <Text color="red" fontWeight="100" fontSize={12}>
                  {error}
                </Text>
              ) : success ? (
                <Text color="green" fontWeight="100" fontSize={12}>
                  {success}
                </Text>
              ) : null}
            </FormControl>
          </>
        )}
      </Box>
    </>
  );
};

export default Home;
