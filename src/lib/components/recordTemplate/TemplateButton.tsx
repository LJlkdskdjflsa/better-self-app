import { Button, useColorModeValue } from '@chakra-ui/react';

import type { CreateRecordTemplateRequest } from '~/lib/types/recordTemplate';

interface TemplateProps {
  template: CreateRecordTemplateRequest;
  onClick?: () => void;
  isSelected?: boolean;
}

const TemplateButton: React.FC<TemplateProps> = ({
  template,
  onClick,
  isSelected = false,
}) => {
  const handleLongPress = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault(); // Prevent the context menu from opening
    // Implement your long press logic here
  };

  // Color mode adaptive colors
  const bgColor = useColorModeValue(
    isSelected ? 'blue.50' : 'white',
    isSelected ? 'blue.900' : 'gray.700'
  );
  const hoverBgColor = useColorModeValue(
    isSelected ? 'blue.100' : 'gray.50',
    isSelected ? 'blue.800' : 'gray.600'
  );
  const borderColor = useColorModeValue(
    isSelected ? 'blue.500' : 'gray.200',
    isSelected ? 'blue.400' : 'gray.600'
  );
  const hoverBorderColor = useColorModeValue(
    isSelected ? 'blue.600' : 'gray.300',
    isSelected ? 'blue.300' : 'gray.500'
  );

  return (
    <Button
      aria-label={template.title}
      onClick={onClick}
      onContextMenu={handleLongPress}
      title={template.title}
      borderRadius="sm"
      width="full"
      fontSize="md"
      height={20}
      fontWeight="bold"
      p={6}
      borderWidth={isSelected ? '2px' : '1px'}
      borderColor={borderColor}
      bg={bgColor}
      _hover={{
        borderColor: hoverBorderColor,
        bg: hoverBgColor,
      }}
    >
      {template.title}
    </Button>
  );
};

export default TemplateButton;
