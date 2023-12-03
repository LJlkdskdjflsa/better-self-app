import {
  Button,
  Flex,
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
  NumberInput,
  NumberInputField,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import FoldableSection from '../newRecord/FoldableSection';
import {
  createPersonalTemplate,
  fetchPersonalTemplates,
} from '~/lib/services/api/recordTemplate';
import type { RecordTemplate } from '~/lib/types/recordTemplate';

import TemplateButton from './TemplateButton';

const publicTemplates: RecordTemplate[] = [
  { title: 'Sleep', focus: 2, point: 3, note: null },
  { title: 'Work', focus: 4, point: 4, note: null },
  { title: 'Rest', focus: 2, point: 3, note: null },
  { title: 'Social', focus: 3, point: 2, note: null },
  { title: 'Traffic', focus: 2, point: 2, note: null },
  { title: 'Entertainment', focus: 3, point: 2, note: null },
  { title: 'Exercise', focus: 4, point: 4, note: null },
];

export const TemplateGrid = () => {
  const [personalTemplates, setPersonalTemplates] = useState<RecordTemplate[]>(
    []
  );
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newTemplateData, setNewTemplateData] = useState({
    title: '',
    focus: 0,
    point: 0,
    note: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewTemplateData({
      ...newTemplateData,
      [name]: value,
    });
  };

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const response = await fetchPersonalTemplates(1, 10); // Example: page 1, size 10
        setPersonalTemplates(
          response.data.map((template) => ({
            title: template.default_title,
            focus: template.default_focus,
            point: template.default_point,
            note: template.default_note,
          }))
        );
      } catch (error) {
        // Handle error
      }
    };

    loadTemplates();
  }, []);

  const handleAddTemplate = async () => {
    try {
      const newTemplate = await createPersonalTemplate(newTemplateData);
      setPersonalTemplates([...personalTemplates, newTemplate]);

      toast({
        title: 'Template Added',
        description: 'The new personal template has been added successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onClose(); // Close the modal after adding
      // Reset the form fields after successful submission
      setNewTemplateData({ title: '', focus: 0, point: 0, note: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add the personal template.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <FoldableSection title="Personal">
        {personalTemplates.map((template) => (
          <TemplateButton key={template.title} template={template} />
        ))}
        <Flex justifyContent="center" mt={4}>
          <Button colorScheme="blue" onClick={onOpen}>
            Add Personal Template
          </Button>
        </Flex>
      </FoldableSection>
      <FoldableSection title="Public">
        {publicTemplates.map((template) => (
          <TemplateButton key={template.title} template={template} />
        ))}
      </FoldableSection>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Template</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                name="title"
                value={newTemplateData.title}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Focus</FormLabel>
              <NumberInput min={0} max={5}>
                <NumberInputField
                  name="focus"
                  value={newTemplateData.focus}
                  onChange={handleInputChange}
                />
              </NumberInput>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Point</FormLabel>
              <NumberInput min={0} max={5}>
                <NumberInputField
                  name="point"
                  value={newTemplateData.point}
                  onChange={handleInputChange}
                />
              </NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel>Note</FormLabel>
              <Textarea
                name="note"
                value={newTemplateData.note}
                onChange={handleInputChange}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddTemplate}>
              Add
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
