import { Flex, Text } from "@chakra-ui/layout";
import type { NextPage } from "next";
import "@fontsource/open-sans";

const Home: NextPage = () => {
  return (
    <Flex justifyContent="center" alignItems="center" height="100vh">
      <Text>this is the home page</Text>
    </Flex>
  );
};

export default Home;
