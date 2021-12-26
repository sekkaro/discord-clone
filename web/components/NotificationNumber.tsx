import { Box, Text } from "@chakra-ui/react";

const NotificationNumber = ({ number }: { number: number }) => (
  <Box ml={2} width={4} as="span" borderRadius={25} bgColor="red">
    <Text textAlign="center" fontWeight="bold" color="white">
      {number}
    </Text>
  </Box>
);

export default NotificationNumber;
