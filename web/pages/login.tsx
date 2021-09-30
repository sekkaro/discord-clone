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
import { Controller, useForm } from "react-hook-form";
import Router from "next/router";
import { login } from "../api/auth";

interface LoginData {
  email: string;
  password: string;
}

const Login: NextPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    shouldUnregister: false,
  });

  const onSubmit = async (data: LoginData) => {
    const { email, password } = data;

    try {
      const res = await login(email, password);

      console.log(res);

      Router.push("/");
    } catch (err: any) {
      console.log(err);
      setError("email", {
        message: err.message,
      });
      setError("password", {
        message: err.message,
      });
    }
  };

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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl mt={3} id="email">
                <FormLabel fontSize={12} color="#c2c2c2" fontWeight={700}>
                  <Text color={errors?.email?.message ? "red" : "#c2c2c2"}>
                    EMAIL
                    {errors?.email?.message && (
                      <Text
                        fontStyle="italic"
                        as="span"
                        fontWeight="200"
                        fontSize={12}
                      >
                        {" - " + errors?.email?.message}
                      </Text>
                    )}
                  </Text>
                </FormLabel>
                <Input
                  borderColor="black"
                  backgroundColor="#292b29"
                  _hover={{
                    borderColor: "black",
                  }}
                  _invalid={{
                    borderColor: "red",
                  }}
                  isInvalid={errors?.email?.message}
                  color="#cccccc"
                  fontWeight={500}
                  fontSize={14}
                  type="email"
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              </FormControl>
            )}
            name="email"
            rules={{
              required: {
                value: true,
                message: "This field is required",
              },
            }}
            defaultValue=""
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl mt={5} id="password">
                <FormLabel fontSize={12} color="#c2c2c2" fontWeight={700}>
                  <Text color={errors?.password?.message ? "red" : "#c2c2c2"}>
                    PASSWORD
                    {errors?.password?.message && (
                      <Text
                        fontStyle="italic"
                        as="span"
                        fontWeight="200"
                        fontSize={12}
                      >
                        {" - " + errors?.password?.message}
                      </Text>
                    )}
                  </Text>
                </FormLabel>
                <Input
                  borderColor="black"
                  backgroundColor="#292b29"
                  _hover={{
                    borderColor: "black",
                  }}
                  _invalid={{
                    borderColor: "red",
                  }}
                  isInvalid={errors?.password?.message}
                  color="#cccccc"
                  fontWeight={500}
                  fontSize={16}
                  type="password"
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              </FormControl>
            )}
            name="password"
            rules={{
              required: {
                value: true,
                message: "This field is required",
              },
            }}
            defaultValue=""
          />
          <Button
            type="submit"
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
        </form>

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

export default Login;
