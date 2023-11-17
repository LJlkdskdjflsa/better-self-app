'use client';

import { Flex } from '@chakra-ui/react';

import MainForm from '~/lib/components/home/MainForm';

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
      <MainForm />
    </Flex>
  );
};

export default Home;
