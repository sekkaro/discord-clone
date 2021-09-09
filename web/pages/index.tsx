import { Box, Flex, Link, Text } from "@chakra-ui/layout";
import type { NextPage } from "next";
import "@fontsource/open-sans";
import {
  FormControl,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Button } from "@chakra-ui/react";
import NextLink from "next/link";

const Home: NextPage = () => {
  return (
    <Flex justifyContent="center" alignItems="center" height="100vh">
      <Box
        backgroundColor="tuna"
        minWidth={475}
        height={400}
        borderRadius={5}
        p={5}
      >
        <Text color="white" fontSize={22} fontWeight={600}>
          Welcome back!
        </Text>
        <Text color="cloudy" fontSize={15}>
          We're so excited to see you again!
        </Text>
        <FormControl mt={3} id="email">
          <FormLabel fontSize={12} color="#c2c2c2" fontWeight={700}>
            EMAIL OR PHONE NUMBER
          </FormLabel>
          <Input
            borderColor="black"
            backgroundColor="#292b29"
            _hover={{
              borderColor: "black",
            }}
            color="#cccccc"
            fontWeight={500}
            fontSize={14}
            type="email"
          />
        </FormControl>
        <FormControl mt={5} id="password">
          <FormLabel fontSize={12} color="#c2c2c2" fontWeight={700}>
            PASSWORD
          </FormLabel>
          <Input
            borderColor="black"
            backgroundColor="#292b29"
            _hover={{
              borderColor: "black",
            }}
            color="#cccccc"
            fontWeight={500}
            fontSize={16}
            type="password"
          />
        </FormControl>
        <Button
          color="white"
          bgColor="cornflowerblue"
          mt={10}
          fontWeight={500}
          fontSize={14}
          w="100%"
          borderRadius={2}
        >
          Login
        </Button>
        <Text mt={3} color="oslogray" fontSize={13}>
          Need an account?{" "}
          <NextLink href="/register">
            <Link color="rgb(66, 153, 225)" fontWeight={500}>
              Register
            </Link>
          </NextLink>
        </Text>
      </Box>
    </Flex>
  );
};

export default Home;
