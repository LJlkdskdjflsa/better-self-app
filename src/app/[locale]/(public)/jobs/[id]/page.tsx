'use client';

import {
  Button,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
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
import { useEffect, useState } from 'react';

import { debug } from '~/lib/components/dashboard/utils/logging';

function JobListingPage({ params }: { params: { id: string } }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // const [
  //   // resume,
  //   setResume,
  // ] = useState(null);
  const [jobDetails, setJobDetails] = useState({
    job: '',
    responsibilities: '',
    requirements: '',
    company: {},
    location: '',
  });

  // const id = "95a12389-f6e3-4863-9b2d-bbb343bb1817"

  useEffect(() => {
    if (params.id) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/public/positions/${params.id}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setJobDetails({
              job: data.data.job,
              responsibilities: data.data.responsibilities,
              requirements: data.data.requirements,
              company: data.data.company,
              location: `${data.data.city}, ${data.data.state.name}, ${data.data.country.name}`,
            });
          }
        })
        .catch((error) => debug(`Error fetching job details: ${error}`));
    }
  }, [params.id]);

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // check if file is null
      // type ignore below

      if (file) {
        // setResume(file); // type-ignoring
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
            {jobDetails.job}
          </Heading>
          <Text>{jobDetails.location}</Text>
          <Text>Full Time - Product Experience</Text>

          <Heading as="h2" size="md">
            Job introduction
          </Heading>
          <Text>{jobDetails.responsibilities}</Text>

          <Heading as="h2" size="md">
            Position requirement
          </Heading>
          <Text>{jobDetails.requirements}</Text>

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
