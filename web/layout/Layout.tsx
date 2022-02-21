import { Flex, Box, Text, Spinner } from "@chakra-ui/react";
import { NextRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchUser } from "../api/auth";
import ChannelLink from "../components/ChannelLink";

import Link from "../components/Link";
import { useChannel } from "../context/ChannelContext";
import { useUser } from "../context/UserContext";

const Layout = ({
  router,
  children,
}: {
  router: NextRouter;
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = useState(true);
  const { friends, setUser, pending } = useUser();
  const { setCurrentChannel } = useChannel();
  const { pathname } = router;

  useEffect(() => {
    fetchUser().then((user) => {
      if (!user) {
        return router.push("/login");
      }
      setUser(user);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (pathname === "/") {
      setCurrentChannel("");
    }
  }, [pathname]);

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
              isActive={pathname === "/"}
              text="Friends"
              href="/"
              fontSize={15}
              pending={pending}
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
            {friends.map((friend) => (
              <ChannelLink key={friend._id} friend={friend} router={router} />
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
