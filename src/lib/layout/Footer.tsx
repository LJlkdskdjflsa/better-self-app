import { Box, Flex, Link } from '@chakra-ui/react';

import BottomNavBar from '../components/common/BottomNavBar';

const Footer = () => {
  return (
    <Flex as="footer" width="full" justifyContent="center">
      {/* <Text fontSize="sm">
        {new Date().getFullYear()} -{' '}
        Better Self
      </Text> */}
      <Flex as="footer" p={4} justifyContent="center" alignItems="center">
        <Box>
          Want to be better toghether.? Join our
          <Link
            href="https://line.me/ti/g/uSNjiBPvW_"
            isExternal
            color="teal.500"
            ml={1}
          >
            Better Group (Line)
          </Link>
        </Box>
      </Flex>
      <BottomNavBar />
    </Flex>
  );
};

export default Footer;
