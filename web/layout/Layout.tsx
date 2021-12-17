import { Flex, Box, Button } from "@chakra-ui/react";
import { NextRouter } from "next/router";
import NextLink from "next/link";

const Layout = ({
  router,
  children,
}: {
  router: NextRouter;
  children: React.ReactNode;
}) => {
  return (
    <Flex justifyContent="center" height="100vh">
      <Box width="20%" bgColor="darktuna" p={2}>
        <NextLink href="/">
          <Button
            color="#c2c2c2"
            fontWeight={400}
            bgColor="darktuna"
            p={2}
            width="100%"
            height={30}
            fontSize={14}
            _hover={{
              bgColor: "shadow2",
              textColor: "white",
            }}
            isActive={router.pathname === "/"}
            _active={{
              bgColor: "shadow2",
              textColor: "white",
            }}
            _focus={{
              bgColor: "shadow2",
              textColor: "white",
            }}
            as="a"
            textColor="#c2c2c2"
          >
            Friends
          </Button>
        </NextLink>
      </Box>
      <Box width="80%" bgColor="tuna">
        {children}
      </Box>
    </Flex>
  );
};

export default Layout;
