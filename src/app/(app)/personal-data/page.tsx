'use client';

import { Box, Button, Flex } from '@chakra-ui/react';
import Link from 'next/link';
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
      <Flex as="footer" p={4} justifyContent="left" alignItems="center">
        <Box>
          Want to be better together.? Join our
          <Link href="https://line.me/ti/g/uSNjiBPvW_" color="teal.500">
            Better Group (Line)
          </Link>
        </Box>
      </Flex>
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
