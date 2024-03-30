'use client';

import {
  Button,
  Container,
  Flex,
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
  Spinner,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { debug } from '~/lib/components/dashboard/utils/logging';
import { toastError, toastSuccess } from '~/utils/toastUtils';

function JobListingBoard({ postId }: { postId: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast(); // Initialize useToast
  const [isLoading, setIsLoading] = useState(true); // Add a state to track loading status
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const { t } = useTranslation();
  const [jobDetails, setJobDetails] = useState({
    job: '',
    responsibilities: '',
    requirements: '',
    company: {},
    location: '',
  });

  const failTitle = t('common:application-failed');

  useEffect(() => {
    if (postId) {
      setIsLoading(true); // Set loading to true when starting to fetch
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/public/positions/${postId}`
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
        .catch((error) => debug(`Error fetching job details: ${error}`))
        .finally(() => setIsLoading(false)); // Set loading to false when fetching is complete
    }
  }, [postId]);

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setResume(file);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!resume) {
      toastError(toast, t(failTitle), 'Please select a resume to upload.');
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const applyUrl = `${apiUrl}/api/v1/public/positions/${postId}/apply`;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone_number', '+1234567890');
    formData.append('reference', 'Online Posting');
    formData.append('candidate_resume', resume);

    try {
      const response = await fetch(applyUrl, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toastSuccess(
          toast,
          'Application Success',
          'Application submitted successfully.'
        );
        onClose();
      } else {
        toastError(
          toast,
          t(failTitle),
          `Failed to submit application: ${result.error_message}`
        );
      }
    } catch (error) {
      toastError(toast, t(failTitle), `Error submitting application: ${error}`);
    }
  };

  if (isLoading) {
    return (
      <Flex height="100vh" justifyContent="center" alignItems="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

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

export default JobListingBoard;
