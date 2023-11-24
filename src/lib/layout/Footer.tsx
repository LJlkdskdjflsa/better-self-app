import { Flex } from '@chakra-ui/react';

import BottomNavBar from '../components/common/BottomNavBar';

const Footer = () => {
  return (
    <Flex as="footer" width="full" justifyContent="center">
      {/* <Text fontSize="sm">
        {new Date().getFullYear()} -{' '}
        Better Self
      </Text> */}

      <BottomNavBar />
    </Flex>
  );
};

export default Footer;
