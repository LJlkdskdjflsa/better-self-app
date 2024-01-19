'use client';

import { Flex } from '@chakra-ui/react';

import { useAuth } from '~/lib/components/hooks/useAuth';
import NewRecordForm from '~/lib/components/newRecord/NewRecordForm';

const Home = () => {
  useAuth('/');
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
      <NewRecordForm />
    </Flex>
  );
};

export default Home;
