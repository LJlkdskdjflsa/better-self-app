'use client';

import { Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';

import AppFooter from './AppFooter';
import AppHeader from './AppHeader';

type LayoutProps = {
  children: ReactNode;
};

const AppLayout = ({ children }: LayoutProps) => {
  return (
    <Box margin="8">
      <AppHeader />
      <Box as="main" marginY={22}>
        {children}
      </Box>
      <AppFooter />
    </Box>
  );
};

export default AppLayout;
