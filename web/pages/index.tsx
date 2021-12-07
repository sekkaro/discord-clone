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

import { FrType, PageProps } from "../types";
import { socket } from "../utils/context";
import {
  cancelFriendRequest as cancelFriendRequestAPI,
  sendFriendRequest as sendFriendRequestAPI,
  acceptFriendRequest as acceptFriendRequestAPI,
  fetchUser,
} from "../api/fr";
import FriendList from "../components/FriendList";

const Home: NextPage<PageProps> = ({ user }) => {
  const [buttonState, setButtonState] = useState("all");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fr, setFr] = useState(user?.fr || []);
  const [friends, setFriends] = useState(user?.friends || []);
  const [pending, setPending] = useState(0);
  const inputRef = useRef() as LegacyRef<HTMLInputElement>;

  useEffect(() => {
    socket.on("user", async () => {
      const { fr, friends } = await fetchUser();
      setFr(fr);
      setFriends(friends);
    });

    return () => {
      socket.off("user");
    };
  }, []);

  useEffect(() => {
    let count = 0;
    fr.forEach((r) => {
      if (r.type === FrType.IN) {
        count += 1;
      }
    });
    setPending(count);
  }, [fr]);

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
    userId: string
  ) => {
    const fr = await cancelFriendRequestAPI(id);
    if (!fr) {
      // oops try again
      return;
    }
    setFr(fr);
    if (type === FrType.OUT) {
      socket.emit(
        "updateUser",
        { userId, senderId: user?._id, isAccept: false },
        (error: string | undefined) => {
          if (error) {
            console.log(error);
          }
        }
      );
    }
  };

  const acceptFriendRequest = async (id: string, userId: string) => {
    const { fr, friends, message } = await acceptFriendRequestAPI(id, userId);
    if (message) {
      // oops try again
      return;
    }
    setFr(fr);
    setFriends(friends);
    socket.emit(
      "updateUser",
      { userId, senderId: user?._id, isAccept: true },
      (error: string | undefined) => {
        if (error) {
          console.log(error);
        }
      }
    );
  };

  return (
    <Flex justifyContent="center" height="100vh">
      <Box width="20%">menu</Box>
      <Box width="80%" bgColor="tuna">
        <Flex
          height={50}
          pt={1}
          pb={1}
          alignItems="center"
          borderBottom="2px solid rgba(0, 0, 0, 0.1)"
        >
          <Text ml={2} color="white" fontWeight={500}>
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
              bgColor: "rgba(0, 0, 0, 0.1)",
              textColor: "white",
            }}
            _active={{
              bgColor: "rgba(0, 0, 0, 0.1)",
              textColor: "white",
            }}
            _focus={{
              bgColor: "rgba(0, 0, 0, 0.1)",
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
              bgColor: "rgba(0, 0, 0, 0.1)",
              textColor: "white",
            }}
            _active={{
              bgColor: "rgba(0, 0, 0, 0.1)",
              textColor: "white",
            }}
            _focus={{
              boxShadow: "none",
              bgColor: "rgba(0, 0, 0, 0.1)",
              textColor: "white",
            }}
            isActive={buttonState === "pending"}
            onClick={() => setButtonState("pending")}
          >
            Pending
            {pending > 0 && (
              <Box ml={2} width={4} as="span" borderRadius={25} bgColor="red">
                <Text fontWeight="bold" color="white">
                  {" " + pending}
                </Text>
              </Box>
            )}
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
      </Box>
    </Flex>
  );
};

export default Home;
