import { Box, Flex } from '@chakra-ui/react';

import AuthNav from '~/lib/layout/AuthNav';

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <Flex direction="column" minH="100vh">
      <AuthNav />
      <Box flex="1" w="100%" bg="gray.100">
        {children}
      </Box>
    </Flex>
  );
};

export default RootLayout;
