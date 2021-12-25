import { Flex, Box, Text } from "@chakra-ui/react";
import { NextRouter } from "next/router";

import Link from "../components/Link";
import { useUser } from "../context/UserContext";

const Layout = ({
  router,
  children,
}: {
  router: NextRouter;
  children: React.ReactNode;
}) => {
  const { friends } = useUser();

  return (
    <Flex justifyContent="center" height="100vh">
      <Box width="20%" bgColor="darktuna" p={2}>
        <Link
          isActive={router.pathname === "/"}
          text="Friends"
          href="/"
          fontSize={15}
        />
        {friends.length > 0 && (
          <Text
            mt={2}
            mb={2}
            ml={2}
            color="#c2c2c2"
            fontSize={12}
            fontWeight={600}
          >
            DIRECT MESSAGES
          </Text>
        )}
        {friends.map(({ _id, user: { username }, channel }) => (
          <Link
            mt={0.5}
            key={_id}
            isActive={router.asPath === `/channel/${channel}`}
            text={username}
            href={`/channel/${channel}`}
            fontSize={14}
          />
        ))}
      </Box>
      <Box width="80%" bgColor="tuna">
        {children}
      </Box>
    </Flex>
  );
};

export default Layout;
