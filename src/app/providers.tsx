'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { QueryClient, QueryClientProvider } from 'react-query';

import { Chakra as ChakraProvider } from '~/lib/components/Chakra';
import { ModalProvider } from '~/lib/components/common/ModalProvider';

export const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <CacheProvider>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <ModalProvider>{children}</ModalProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </CacheProvider>
  );
};

export default Providers;
