'use client';

import {
  Button,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';

function JobListingPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [
    // resume,
    setResume,
  ] = useState(null);

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // check if file is null
      // type ignore below

      if (file) {
        setResume(file); // type-ignoring
      }
    }
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Process form data here
    // console.log({ name, email, resume });
    // Close the modal after submission
    onClose();
  };

  return (
    <Container maxW="container.md" py={10} w="100%">
      <HStack spacing={100} w="100%">
        <VStack spacing={5} align="start" w="60%">
          <Heading as="h1" size="xl">
            Product Content Designer
          </Heading>
          <Text>Taipei, TW</Text>
          <Text>Full Time - Product Experience</Text>

          <Heading as="h2" size="md">
            Job introduction
          </Heading>
          <List spacing={2}>
            <ListItem>
              Content Creation: Writing, editing, and testing content for apps,
              websites, FAQs, emails, and other digital channels.
            </ListItem>
            <ListItem>
              User-Centered Design: Ensuring that content meets the needs and
              expectations of the target audience.
            </ListItem>
            {/* Add other responsibilities */}
          </List>

          <Heading as="h2" size="md">
            Position requirement
          </Heading>
          <List spacing={2}>
            <ListItem>
              5+ years’ experience in UX writing in the internet/ software
              products.
            </ListItem>
            <ListItem>
              Language skills: excellent in English (native speaker) and very
              good in Mandarin (Traditional Characters).
            </ListItem>
            {/* Add other requirements */}
          </List>

          {/* Use HStack for horizontal layout */}
        </VStack>
        <VStack spacing={3} w="20%">
          <Button colorScheme="blue" onClick={onOpen}>
            Apply to Position
          </Button>
          {/* Modal for application form */}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Application Form</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    placeholder="Your email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Resume</FormLabel>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeChange}
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                  Submit Application
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {/* <Button colorScheme="blue">Apply Using LinkedIn</Button> */}
        </VStack>
      </HStack>
    </Container>
  );
}

export default JobListingPage;
