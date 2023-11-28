'use client';

import { Flex } from '@chakra-ui/react';

import LandingPage from '~/lib/components/landing/LandingPage';

const Home = () => {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      gap={4}
      mb={8}
      w="full"
    >
      <LandingPage />
    </Flex>
  );
};

export default Home;
