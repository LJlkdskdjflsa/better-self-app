'use client';

import { Box } from '@chakra-ui/react';

import { TemplateGrid } from '~/lib/components/recordTemplate/TemplateGrid';

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
      <TemplateGrid />
    </Box>
  );
};

export default Register;
