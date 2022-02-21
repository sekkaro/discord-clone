import { NextRouter } from "next/router";
import { useEffect } from "react";
import { useChannel } from "../context/ChannelContext";
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
  const { unseenCount, setCurrentChannel } = useChannel();
  const link = `/channel/${channel}`;
  const isActive = router.asPath === link;

  useEffect(() => {
    if (isActive) {
      setFriend(user);
      setCurrentChannel(channel);
    }
  }, [isActive]);

  return (
    <Link
      mt={0.5}
      isActive={isActive}
      text={user.username}
      href={link}
      fontSize={14}
      pending={unseenCount[channel] ? unseenCount[channel] : 0}
    />
  );
};

export default ChannelLink;
