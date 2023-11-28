'use client';

import { Box } from '@chakra-ui/react';

import Statistics from '~/lib/components/statistics/Statistics';

const Register = () => {
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
      <Statistics />
    </Box>
  );
};

export default Register;
