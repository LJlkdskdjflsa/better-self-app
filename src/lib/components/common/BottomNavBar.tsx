import { Flex, IconButton, useColorMode } from '@chakra-ui/react';
import Link from 'next/link';
import { FiFileText, FiBarChart, FiPlus, FiUser } from 'react-icons/fi'; // Import FiBarChart
import { HiOutlineTemplate } from 'react-icons/hi';

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
      <Link href="/templates" passHref>
        {' '}
        {/* Update the href to your desired link */}
        <IconButton aria-label="Templates" icon={<HiOutlineTemplate />} />{' '}
        {/* Replace FiTemplate with your chosen icon */}
      </Link>
      <Link href="/new-record" passHref>
        <IconButton aria-label="NewRecord" icon={<FiPlus />} />
      </Link>
      <Link href="/personal-data" passHref>
        {' '}
        {/* Update href to the personal data page */}
        <IconButton aria-label="Personal Data" icon={<FiUser />} />
      </Link>
    </Flex>
  );
};

export default BottomNavBar;
