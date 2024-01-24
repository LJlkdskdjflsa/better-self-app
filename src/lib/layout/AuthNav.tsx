'use client';

import { Box, Flex, Image, useColorModeValue } from '@chakra-ui/react';

export default function AuthNav() {
  return (
    <Box w="100%" bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Image src="logo.png" alt="Logo" boxSize="50px" />
      </Flex>
    </Box>
  );
}
