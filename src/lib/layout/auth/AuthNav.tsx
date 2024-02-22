'use client';

import { Box, Flex, Image, Spacer } from '@chakra-ui/react';

import LanguageChanger from '~/lib/components/LanguageChanger';

export default function AuthNav() {
  return (
    <Box w="100%" px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Image src="logo.png" alt="Logo" boxSize="50px" />
        <Spacer />
        <LanguageChanger />
      </Flex>
    </Box>
  );
}
