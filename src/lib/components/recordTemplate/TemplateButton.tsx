import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import type { RecordTemplate } from '~/lib/types/recordTemplate';

interface TemplateProps {
  template: RecordTemplate;
}

const TemplateButton: React.FC<TemplateProps> = ({ template }) => {
  const router = useRouter();

  const handleClick = () => {
    // Navigate to the New Record form with template data

    // 1. Save the template data to local storage
    localStorage.setItem('template', JSON.stringify(template));

    // 2. Navigate to the New Record form
    router.push('/new-record');
  };

  const handleLongPress = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault(); // Prevent the context menu from opening
    // alert(`Template: ${template.title}`); // Replace with a more sophisticated tooltip if needed
  };

  return (
    <Button
      aria-label={template.title}
      onClick={handleClick}
      onContextMenu={handleLongPress}
      title={template.title}
      borderRadius="full" // This makes the button round
      p={6} // Adjust padding as needed
      // Styling the text
      fontSize="sm"
      fontWeight="bold"
    >
      {template.title}
    </Button>
  );
};

export default TemplateButton;
