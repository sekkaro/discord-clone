import { Box, Flex, Link, Text } from "@chakra-ui/layout";
import type { NextPage } from "next";
import "@fontsource/open-sans";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Button } from "@chakra-ui/react";
import NextLink from "next/link";

const Register: NextPage = () => {
  return (
    <Flex justifyContent="center" alignItems="center" height="100vh">
      <Box
        backgroundColor="tuna"
        minWidth={475}
        height={450}
        borderRadius={5}
        p={5}
      >
        <Text color="white" textAlign="center" fontSize={22} fontWeight={600}>
          Create an account
        </Text>
        <FormControl mt={3} id="email">
          <FormLabel fontSize={12} color="#c2c2c2" fontWeight={700}>
            EMAIL
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
        <FormControl mt={4} id="username">
          <FormLabel fontSize={12} color="#c2c2c2" fontWeight={700}>
            USERNAME
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
          />
        </FormControl>
        <FormControl mt={4} id="password">
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
          Register
        </Button>
        <Box mt={2}>
          <NextLink href="/">
            <Link color="rgb(66, 153, 225)" fontWeight={500} fontSize={13}>
              Already have an account?
            </Link>
          </NextLink>
        </Box>
      </Box>
    </Flex>
  );
};

export default Register;
