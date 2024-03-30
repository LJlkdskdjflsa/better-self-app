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
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { debug } from '~/lib/components/dashboard/utils/logging';
import { toastError, toastSuccess } from '~/utils/toastUtils';

function JobListingBoard({ postId }: { postId: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast(); // Initialize useToast
  const [isLoading, setIsLoading] = useState(true); // Add a state to track loading status
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to track form submission
  const { t } = useTranslation();
  const [jobDetails, setJobDetails] = useState({
    job: '',
    responsibilities: '',
    requirements: '',
    company: {},
    location: '',
  });

  // React Hook Form setup
  const {
    handleSubmit,
    // control,
    formState: { errors },
    register,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      resume: undefined,
    },
  });

  const onSubmit = async (data: {
    name: string;
    email: string;
    resume?: FileList;
  }) => {
    setIsSubmitting(true);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const applyUrl = `${apiUrl}/api/v1/public/positions/${postId}/apply`;

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone_number', '+1234567890'); // Static for example
    formData.append('reference', 'Online Posting');
    if (data.resume) {
      formData.append('candidate_resume', data.resume[0]); // Ensure resume is not undefined before appending
    }

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
          t('common:application-failed'),
          `Failed to submit application: ${result.error_message}`
        );
      }
    } catch (error) {
      toastError(
        toast,
        t('common:application-failed'),
        `Error submitting application: ${error}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody pb={6}>
                  <FormControl isInvalid={!!errors.name}>
                    <FormLabel>Name</FormLabel>
                    <Input
                      placeholder="Your name"
                      {...register('name', { required: 'Name is required' })}
                    />
                    {errors.name && (
                      <Text color="red.500">{errors.name.message}</Text>
                    )}
                  </FormControl>
                  <FormControl mt={4} isInvalid={!!errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      placeholder="Your email"
                      type="email"
                      {...register('email', { required: 'Email is required' })}
                    />
                    {errors.email && (
                      <Text color="red.500">{errors.email.message}</Text>
                    )}
                  </FormControl>
                  <FormControl mt={4} isInvalid={!!errors.resume}>
                    <FormLabel>Resume</FormLabel>
                    <Input
                      type="file"
                      accept=".pdf"
                      {...register('resume', {
                        required: 'Resume is required',
                      })}
                    />
                    {errors.resume && (
                      <Text color="red.500">{errors.resume.message}</Text>
                    )}
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Submit Application
                  </Button>
                  <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          {/* <Button colorScheme="blue">Apply Using LinkedIn</Button> */}
        </VStack>
      </HStack>
    </Container>
  );
}

export default JobListingBoard;
