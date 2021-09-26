import { Flex, Text } from "@chakra-ui/layout";
import type { NextPage } from "next";
import { useEffect } from "react";
import { io } from "socket.io-client";
import "@fontsource/open-sans";

import { PageProps } from "../types";

const Home: NextPage<PageProps> = ({ user }) => {
  console.log(user);

  useEffect(() => {
    const socket = io("/");
  }, []);

  return (
    <Flex justifyContent="center" alignItems="center" height="100vh">
      <Text>this is the home page</Text>
    </Flex>
  );
};

export default Home;
