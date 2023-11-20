'use client';

import { Box } from '@chakra-ui/react';

import RecordList from '~/lib/components/records/RecordList';

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
      <RecordList />
    </Box>
  );
};

export default Register;
