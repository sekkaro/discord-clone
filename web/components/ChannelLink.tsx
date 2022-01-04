import { NextRouter } from "next/router";
import { useEffect } from "react";
import { useUser } from "../context/UserContext";

import { Friend } from "../types";
import Link from "./Link";

const ChannelLink = ({
  friend: { user, channel },
  router,
}: {
  friend: Friend;
  router: NextRouter;
}) => {
  const { setFriend } = useUser();
  const link = `/channel/${channel}`;
  const isActive = router.asPath === link;

  useEffect(() => {
    if (isActive) {
      setFriend(user);
    }
  }, [isActive]);

  return (
    <Link
      mt={0.5}
      isActive={isActive}
      text={user.username}
      href={link}
      fontSize={14}
    />
  );
};

export default ChannelLink;
