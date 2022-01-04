import { Flex, Text, Input, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { useUser } from "../../context/UserContext";

const Channel = () => {
  const router = useRouter();
  const { friend } = useUser();

  return (
    <>
      <Flex
        height={50}
        pt={1}
        pb={1}
        alignItems="center"
        borderBottom="2px solid rgba(0, 0, 0, 0.1)"
      >
        <Text ml={2} color="white" fontWeight={500}>
          {friend?.username}
        </Text>
      </Flex>
      <Box p={5} height="80vh"></Box>
      <Input
        p={5}
        bgColor="shadow2"
        borderWidth={0}
        textColor="white"
        fontSize={15}
        _focus={{
          outline: "none",
        }}
        _placeholder={{
          textColor: "gray",
        }}
        placeholder={`Message ${friend?.username}`}
      />
    </>
  );
};

export default Channel;
