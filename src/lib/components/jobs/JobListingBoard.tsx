'use client';

import {
  Box,
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

type Company = {
  can_use_application_note: boolean;
  // other properties of the company object
};

function JobListingBoard({ postId }: { postId: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast(); // Initialize useToast
  const [isLoading, setIsLoading] = useState(true); // Add a state to track loading status
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to track form submission
  const { t } = useTranslation();
  const [, setJobDetails] = useState({
    job: '',
    responsibilities: '',
    requirements: '',
    company: {} as Company, // Use the Company type here
    location: '',
    job_type: '',
    department: '',
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
      application_note: '', // Add application_note to the defaultValues
    },
  });

  const onSubmit = async (data: {
    name: string;
    email: string;
    resume?: FileList;
    application_note: string; // Add application_note to the data type
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
    formData.append('application_note', data.application_note); // Append application_note to formData

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
              company: data.data.company as Company, // Cast to Company type
              location: `${data.data.city}, ${data.data.state.name}, ${data.data.country.name}`,
              job_type: data.data.job_type,
              department: data.data.department,
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
      <HStack spacing={100} w="100%" whiteSpace="pre-wrap">
        <VStack spacing={5} align="start" w="60%">
          <Heading as="h1" size="xl">
            履歷健檢
          </Heading>
          <Box h="200px" />
          <Button colorScheme="blue" onClick={onOpen}>
            取得 AI 建議
          </Button>
          {/* Use HStack for horizontal layout */}
        </VStack>
        <VStack spacing={3} w="20%">
          {/* Modal for application form */}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>上傳履歷</ModalHeader>
              <ModalCloseButton />
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody pb={6}>
                  <FormControl isInvalid={!!errors.name}>
                    <FormLabel>{t('common:name')}</FormLabel>
                    <Input
                      // placeholder={t('common:name')}
                      {...register('name', { required: 'Name is required' })}
                    />
                    {errors.name && (
                      <Text color="red.500">{errors.name.message}</Text>
                    )}
                  </FormControl>
                  <FormControl mt={4} isInvalid={!!errors.email}>
                    <FormLabel>{t('common:email')}</FormLabel>
                    <Input
                      // placeholder={t('common:email')}
                      type="email"
                      {...register('email', { required: 'Email is required' })}
                    />
                    {errors.email && (
                      <Text color="red.500">{errors.email.message}</Text>
                    )}
                  </FormControl>
                  <FormControl mt={4} isInvalid={!!errors.resume}>
                    <FormLabel>履歷</FormLabel>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      // customise choose file

                      {...register('resume', {
                        required: 'Resume is required',
                      })}
                    />
                    {errors.resume && (
                      <Text color="red.500">{errors.resume.message}</Text>
                    )}
                  </FormControl>
                  {/* Application Note if jobDetails.company.can_use_application_note is true then render */}
                  {/* {jobDetails.company.can_use_application_note && (
                    <FormControl mt={4} isInvalid={!!errors.application_note}>
                      <FormLabel>Application Note</FormLabel>
                      <Input
                        type="text"
                        {...register('application_note', {
                          required: 'Application Note is required',
                        })}
                      />
                      {errors.application_note && (
                        <Text color="red.500">
                          {errors.application_note.message}
                        </Text>
                      )}
                    </FormControl>
                  )} */}
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    {t('common:confirm')}
                  </Button>
                  <Button onClick={onClose}>{t('common:cancel')}</Button>
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
