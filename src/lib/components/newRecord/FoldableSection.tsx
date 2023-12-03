import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Heading, IconButton, VStack } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { useState } from 'react';

interface FoldableSectionProps {
  title: string;
  children: ReactNode;
}

const FoldableSection = ({ title, children }: FoldableSectionProps) => {
  // Initialize isOpen to true
  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <Box mb={4}>
      <Heading size="md" mb={2} display="flex" alignItems="center">
        <IconButton
          aria-label="Toggle Section"
          icon={isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
          onClick={toggleOpen}
          size="sm"
          mr={2}
        />
        {title}
      </Heading>
      {isOpen && <VStack spacing={4}>{children}</VStack>}
    </Box>
  );
};

export default FoldableSection;
