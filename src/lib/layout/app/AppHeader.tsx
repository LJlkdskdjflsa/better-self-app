import { Flex, Spacer } from '@chakra-ui/react';

import ThemeToggle from '../ThemeToggle';

const AppHeader = () => {
  return (
    <Flex>
      <Spacer />
      <ThemeToggle />
    </Flex>
  );
};

export default AppHeader;
