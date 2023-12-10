import { CloseIcon } from '@chakra-ui/icons';
import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Textarea,
  RadioGroup,
  Radio,
  useToast,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { useToken } from '../hooks/useToken';
import type { CreateRecordTemplateRequest } from '~/lib/types/recordTemplate';
import {
  fetchLastEndTime,
  transferLocalTimeToUtcTimestamp,
  getCurrentLocalTime,
} from '~/utils/timeUtils';

interface FormData {
  title: string;
  startTime: string;
  endTime: string;
  focus: number;
  point: number;
  note: string;
}

export default function NewRecordForm() {
  const toast = useToast();
  const [token] = useToken();

  // Set initial form data
  const [formData, setFormData] = useState<FormData>({
    title: '',
    startTime: '',
    endTime: '',
    focus: 0,
    point: 0,
    note: '',
  });

  useEffect(() => {
    // Check if window is defined (i.e., running on client side)
    if (typeof window !== 'undefined') {
      const templateData: CreateRecordTemplateRequest = JSON.parse(
        localStorage.getItem('template') || '{}'
      );
      // Update form data with template if available
      if (templateData?.title) {
        setFormData({
          title: templateData.title,
          startTime: '',
          endTime: '',
          focus: templateData.focus || 0,
          point: templateData.point || 0,
          note: templateData.note || '',
        });
      }
    }
  }, []);

  // Function to clear title
  const clearTitle = () => {
    setFormData({ ...formData, title: '' });
  };

  // Function to clear note
  const clearNote = () => {
    setFormData({ ...formData, note: '' });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'focus' || name === 'point') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: parseInt(value, 10),
      }));
    } else if (name === 'startTime' || name === 'endTime') {
      let validTime = value;

      // Check if the hour part is 24 and adjust to 00
      if (value.startsWith('24:')) {
        validTime = `00:${value.substring(3)}`;
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: validTime,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      toast({
        title: 'Authentication Error',
        description: 'No token found. Please log in.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return; // Stop the function if there's no token
    }

    const payload = {
      start_time: transferLocalTimeToUtcTimestamp(formData.startTime),
      end_time: transferLocalTimeToUtcTimestamp(formData.endTime),
      title: formData.title,
      note: formData.note,
      focus: formData.focus,
      point: formData.point,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/records`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.status === 201) {
        // Reset form data to initial values after successful submission
        toast({
          title: 'Success',
          description: 'Record created successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        setFormData({
          title: '',
          startTime: '',
          endTime: '',
          focus: 0,
          point: 0,
          note: '',
        });
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while submitting the form.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const setLastEndTime = async () => {
    if (!token) {
      // Handle the case when token is null
      toast({
        title: 'Error',
        description: 'No token found. Please log in.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (typeof token === 'string') {
      const lastEndTime = await fetchLastEndTime(token);
      if (lastEndTime) {
        setFormData({ ...formData, startTime: lastEndTime });
      } else {
        // Handle the case when no last end time is returned
        toast({
          title: 'Error',
          description: 'No last end time found.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      // Handle the case when token is a function
      toast({
        title: 'Error',
        description: 'Invalid token.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  return (
    <Container maxW="container.md">
      <Heading as="h1" mb={4}>
        Better Self
      </Heading>

      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Flex>
              <Input
                id="title"
                name="title"
                type="text"
                onChange={handleChange}
                value={formData.title}
              />
              <Button onClick={clearTitle} ml={2}>
                <CloseIcon />
              </Button>
            </Flex>
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor="start-time">Start Time</FormLabel>
            <Flex>
              <Input
                id="start-time"
                name="startTime"
                type="time"
                onChange={handleChange}
                value={formData.startTime}
              />
              <Spacer />
              <Button
                onClick={() =>
                  setFormData({ ...formData, startTime: getCurrentLocalTime() })
                }
                ml={2} // Margin left for spacing
              >
                Now
              </Button>
              <Button onClick={setLastEndTime} ml={2}>
                Last End
              </Button>
            </Flex>
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="end-time">End Time</FormLabel>
            <Flex>
              <Input
                id="end-time"
                name="endTime"
                type="time"
                onChange={handleChange}
                value={formData.endTime}
              />
              <Spacer />
              <Button
                onClick={() =>
                  setFormData({ ...formData, endTime: getCurrentLocalTime() })
                }
                ml={2} // Margin left for spacing
              >
                Now
              </Button>
            </Flex>
          </FormControl>

          <FormControl>
            <FormLabel>Focus</FormLabel>
            <RadioGroup
              onChange={(value: string) =>
                setFormData((prev) => ({ ...prev, focus: parseInt(value, 10) }))
              }
              value={formData.focus.toString()}
              name="focus"
            >
              <Stack direction="row">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Radio key={value} value={value.toString()}>
                    {value}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </FormControl>
          <FormControl>
            <FormLabel>Point</FormLabel>
            <RadioGroup
              onChange={(value: string) =>
                setFormData((prev) => ({ ...prev, point: parseInt(value, 10) }))
              }
              value={formData.point.toString()}
              name="point"
            >
              <Stack direction="row">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Radio key={value} value={value.toString()}>
                    {value}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </FormControl>
          <FormControl>
            <Flex>
              <FormLabel htmlFor="note">Note</FormLabel>
              <Spacer />
              <Button onClick={clearNote} ml={2} p={3}>
                <CloseIcon />
              </Button>
            </Flex>
            <Flex>
              <Textarea
                id="note"
                name="note"
                onChange={handleChange}
                value={formData.note}
              />
            </Flex>
          </FormControl>
          <Button colorScheme="blue" type="submit">
            Submit
          </Button>
        </Stack>
      </form>
    </Container>
  );
}
