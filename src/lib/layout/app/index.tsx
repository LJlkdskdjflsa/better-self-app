'use client';

import { Box, Flex } from '@chakra-ui/react';
import type { ReactNode } from 'react';

import AppNav from './AppNav';

type LayoutProps = {
  children: ReactNode;
};

const AppLayout = ({ children }: LayoutProps) => {
  return (
    <Flex direction="column" minH="100vh">
      <AppNav />
      <Box flex="1" w="100%" bg="gray.100">
        {children}
      </Box>
    </Flex>
  );
};

export default AppLayout;
