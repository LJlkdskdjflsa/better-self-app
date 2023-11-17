'use client';

import { Flex } from '@chakra-ui/react';

import LoginForm from '~/lib/components/home/LoginForm';

const Login = () => {
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
      <LoginForm />
    </Flex>
  );
};

export default Login;
