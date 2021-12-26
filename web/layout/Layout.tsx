import { Flex, Box, Text, Spinner } from "@chakra-ui/react";
import { NextRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchUser } from "../api/auth";

import Link from "../components/Link";
import { useUser } from "../context/UserContext";

const Layout = ({
  router,
  children,
}: {
  router: NextRouter;
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = useState(true);
  const { friends, setUser } = useUser();

  useEffect(() => {
    fetchUser().then((user) => {
      if (!user) {
        return router.push("/login");
      }
      setUser(user);
      setLoading(false);
    });
  }, []);

  return (
    <Flex justifyContent="center" height="100vh">
      {loading ? (
        <Flex
          width="100%"
          bgColor="darktuna"
          p={2}
          alignItems="center"
          justifyContent="center"
        >
          <Spinner size="xl" thickness="4px" color="cornflowerblue" />
        </Flex>
      ) : (
        <>
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
        </>
      )}
    </Flex>
  );
};

export default Layout;
