import NextLink from "next/link";
import { Button } from "@chakra-ui/react";
import { useUser } from "../context/UserContext";
import NotificationNumber from "./NotificationNumber";

const Link = ({
  isActive,
  text,
  href,
  mt,
  fontSize,
}: {
  isActive: boolean;
  text: string;
  href: string;
  mt?: number;
  fontSize: number;
}) => {
  const { pending } = useUser();

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
          bgColor: "shadow2",
          textColor: "white",
        }}
        isActive={isActive}
        _active={{
          bgColor: "shadow2",
          textColor: "white",
        }}
        _focus={{
          bgColor: "shadow2",
          textColor: "white",
        }}
        as="a"
      >
        {text}
        {href === "/" && pending > 0 && <NotificationNumber number={pending} />}
      </Button>
    </NextLink>
  );
};

export default Link;
