import { Flex, IconButton, useColorMode } from '@chakra-ui/react';
import Link from 'next/link';
import { FiHome, FiFileText, FiBarChart } from 'react-icons/fi'; // Import FiBarChart

const BottomNavBar = () => {
  const { colorMode } = useColorMode();
  const bgColor = { light: 'gray.100', dark: 'gray.700' }; // Example colors for light and dark themes
  const iconColor = { light: 'black', dark: 'white' }; // Adjust icon colors as needed

  return (
    <Flex
      as="nav"
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      height="60px"
      justifyContent="space-around"
      alignItems="center"
      backgroundColor={bgColor[colorMode]} // Dynamically set background color
      color={iconColor[colorMode]} // Dynamically set icon color
      borderTopWidth="1px"
      boxShadow="sm"
    >
      <Link href="/statistics" passHref>
        <IconButton aria-label="Statistics" icon={<FiBarChart />} />
      </Link>
      <Link href="/records" passHref>
        <IconButton aria-label="Records" icon={<FiFileText />} />
      </Link>
      <Link href="/" passHref>
        <IconButton aria-label="Home" icon={<FiHome />} />
      </Link>
    </Flex>
  );
};

export default BottomNavBar;
