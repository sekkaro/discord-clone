import NextLink from "next/link";
import { Button } from "@chakra-ui/react";

import NotificationNumber from "./NotificationNumber";

const Link = ({
  isActive,
  text,
  href,
  mt,
  fontSize,
  pending,
}: {
  isActive: boolean;
  text: string;
  href: string;
  mt?: number;
  fontSize: number;
  pending: number;
}) => {
  return (
    <NextLink href={href}>
      <Button
        height={10}
        mt={mt}
        color="#c2c2c2"
        justifyContent="flex-start"
        fontWeight={400}
        bgColor="darktuna"
        width="100%"
        fontSize={fontSize}
        _hover={{
          bgColor: "#393c43",
          textColor: "white",
        }}
        isActive={isActive}
        _active={{
          bgColor: "#393c43",
          textColor: "white",
        }}
        _focus={{
          bgColor: "#393c43",
          textColor: "white",
        }}
        as="a"
      >
        {text}
        {pending > 0 && <NotificationNumber number={pending} />}
      </Button>
    </NextLink>
  );
};

export default Link;
