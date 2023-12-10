import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import type { CreateRecordTemplateRequest } from '~/lib/types/recordTemplate';

interface TemplateProps {
  template: CreateRecordTemplateRequest;
}

const TemplateButton: React.FC<TemplateProps> = ({ template }) => {
  const router = useRouter();

  const handleClick = () => {
    localStorage.setItem('template', JSON.stringify(template));
    router.push('/new-record');
  };

  const handleLongPress = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault(); // Prevent the context menu from opening
    // Implement your long press logic here
  };

  return (
    <Button
      aria-label={template.title}
      onClick={handleClick}
      onContextMenu={handleLongPress}
      title={template.title}
      borderRadius="sm" // Or "0" for sharp corners
      width="full" // Makes the button full width
      fontSize="md"
      height={20} // Adjust height as needed
      fontWeight="bold"
      p={6} // Adjust padding as needed
    >
      {template.title}
    </Button>
  );
};

export default TemplateButton;
