'use client';

import { Box, Button, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import { useToken } from '~/lib/components/hooks/useToken';

const PersonalDataPage = () => {
  const router = useRouter();

  const [removeToken] = useToken();

  return (
    <Box
      // direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      gap={4}
      mb={8}
      w="full"
    >
      <Flex as="footer" p={4} justifyContent="left" alignItems="center" />
      <Button
        colorScheme="red"
        mt={4} // Margin top for spacing
        onClick={() => {
          if (typeof removeToken === 'function') {
            removeToken();
          }
          router.push('/login');
        }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default PersonalDataPage;
