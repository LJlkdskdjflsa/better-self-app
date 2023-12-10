import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { updatePersonalTemplate } from '~/lib/services/api/recordTemplate';
import type { CreateRecordTemplateRequest } from '~/lib/types/recordTemplate';

interface UpdateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: CreateRecordTemplateRequest;
}

export const UpdateTemplateModal: React.FC<UpdateTemplateModalProps> = ({
  isOpen,
  onClose,
  template,
}) => {
  const [updatedTemplate, setUpdatedTemplate] = useState(template);
  const toast = useToast();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedTemplate({
      ...updatedTemplate,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdateSubmit = async () => {
    try {
      await updatePersonalTemplate(template.id ?? '', updatedTemplate);
      onClose();
      toast({
        title: 'Update Successful',
        description: 'Your template has been updated.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: (error as Error).message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  // when updatedTemplate changed, re-render
  useEffect(() => {
    setUpdatedTemplate(template);
  }, [template]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Template</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              name="title"
              value={updatedTemplate.title}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Focus</FormLabel>
            <Input
              name="focus"
              type="number"
              value={updatedTemplate.focus}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Point</FormLabel>
            <Input
              name="point"
              type="number"
              value={updatedTemplate.point}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Note</FormLabel>
            <Input
              name="note"
              value={updatedTemplate.note || ''}
              onChange={handleInputChange}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleUpdateSubmit}>Update</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
