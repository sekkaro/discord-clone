import { Box, Flex, Link, Text } from "@chakra-ui/layout";
import type { NextPage } from "next";
import "@fontsource/open-sans";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Button } from "@chakra-ui/react";
import NextLink from "next/link";
import Router from "next/router";
import { Controller, useForm } from "react-hook-form";
import { register } from "../api/auth";
import { autoLogin } from "../utils/autoLogin";

interface RegisterData {
  email: string;
  password: string;
  username: string;
}

const Register: NextPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    shouldUnregister: false,
  });

  const onSubmit = async (data: RegisterData) => {
    const { email, password, username } = data;

    try {
      const json = await register(email, password, username);

      console.log(json);

      Router.push("/");
    } catch (err: any) {
      console.log(err);
      if (err.status === "failed") {
        setError(err.field, {
          message:
            err.field.replace(/(^\w|\s\w)/g, (m: string) => m.toUpperCase()) +
            " is already registered",
        });
      }
    }
  };
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
              required: true,
            }}
            defaultValue=""
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl mt={4} id="username">
                <FormLabel fontSize={12} color="#c2c2c2" fontWeight={700}>
                  <Text color={errors?.username?.message ? "red" : "#c2c2c2"}>
                    USERNAME
                    {errors?.username?.message && (
                      <Text
                        fontStyle="italic"
                        as="span"
                        fontWeight="200"
                        fontSize={12}
                      >
                        {" - " + errors?.username?.message}
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
                  isInvalid={errors?.username?.message}
                  color="#cccccc"
                  fontWeight={500}
                  fontSize={16}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              </FormControl>
            )}
            name="username"
            rules={{
              required: true,
            }}
            defaultValue=""
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl mt={4} id="password">
                <FormLabel fontSize={12} color="#c2c2c2" fontWeight={700}>
                  <Text color="#c2c2c2">PASSWORD</Text>
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
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              </FormControl>
            )}
            name="password"
            rules={{
              required: true,
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
            Register
          </Button>
        </form>
        <Box mt={2}>
          <NextLink href="/login">
            <Link color="rgb(66, 153, 225)" fontWeight={500} fontSize={13}>
              Already have an account?
            </Link>
          </NextLink>
        </Box>
      </Box>
    </Flex>
  );
};

export const getServerSideProps = autoLogin;

export default Register;
