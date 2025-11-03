import { Button } from '@chakra-ui/react';

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

  return (
    <Button
      aria-label={template.title}
      onClick={onClick}
      onContextMenu={handleLongPress}
      title={template.title}
      borderRadius="sm" // Or "0" for sharp corners
      width="full" // Makes the button full width
      fontSize="md"
      height={20} // Adjust height as needed
      fontWeight="bold"
      p={6} // Adjust padding as needed
      borderWidth={isSelected ? '2px' : '1px'}
      borderColor={isSelected ? 'blue.500' : 'gray.200'}
      bg={isSelected ? 'blue.50' : 'white'}
      _hover={{
        borderColor: isSelected ? 'blue.600' : 'gray.300',
        bg: isSelected ? 'blue.100' : 'gray.50',
      }}
    >
      {template.title}
    </Button>
  );
};

export default TemplateButton;
