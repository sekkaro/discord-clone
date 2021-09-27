import { Box, Flex, Text } from "@chakra-ui/layout";
import type { GetServerSideProps, NextPage } from "next";
import React, { useEffect, useState } from "react";
import "@fontsource/open-sans";
import { Button } from "@chakra-ui/button";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { FormControl } from "@chakra-ui/form-control";
import fetch from "isomorphic-unfetch";

import { PageProps } from "../types";
import { socket } from "../utils/context";

const Home: NextPage<PageProps> = ({ user }) => {
  const [buttonState, setButtonState] = useState("all");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fr, setFr] = useState(user?.fr.length || 0);

  useEffect(() => {
    socket.emit("init", user?._id, () => {
      console.log("socket initialized");
    });

    socket.on("fr", async () => {
      // request
    });

    return () => {
      socket.off("init");
      socket.off("fr");
    };
  }, []);

  const sendFriendRequest = () => {
    socket.emit(
      "sendFr",
      { username, id: user?._id },
      (error: string | undefined) => {
        if (error) {
          console.log(error);
          setError(
            "Hm, didn't work. Double check that the capitalization, spelling, any spaces, and numbers are correct."
          );
          setSuccess("");
          return;
        }
        setSuccess(`Success! Your friend request to ${username} was sent`);
        setUsername("");
        setError("");
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
            {fr > 0 && (
              <Box ml={2} width={4} as="span" borderRadius={25} bgColor="red">
                <Text fontWeight="bold" color="white">
                  {" " + fr}
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
            <>
              <Text>ALL FRIENDS</Text>
            </>
          ) : buttonState === "pending" ? (
            <>
              <Text>There are no pending friend requests</Text>
            </>
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
                    borderColor="black"
                    backgroundColor="#292b29"
                    _hover={{
                      borderColor: "black",
                    }}
                    color="#cccccc"
                    fontWeight={500}
                    fontSize={16}
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                    _invalid={{
                      borderColor: "red",
                    }}
                    _valid={{
                      borderColor: "green",
                    }}
                    value={username}
                    isInvalid={!!error}
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
