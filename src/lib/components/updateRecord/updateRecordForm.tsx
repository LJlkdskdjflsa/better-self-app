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
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useToken } from '../hooks/useToken';
import { fetchRecordById } from '~/lib/services/api/record';
import { formatDateTimeLocal } from '~/utils/timeUtils';

interface FormData {
  title: string;
  startTime: string;
  endTime: string;
  focus: number;
  point: number;
  note: string;
}

export default function UpdateRecordForm({ recordId }: { recordId: string }) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    startTime: '',
    endTime: '',
    focus: 0,
    point: 0,
    note: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [token] = useToken();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const loadRecordData = async () => {
      const data = await fetchRecordById(recordId);
      setFormData({
        title: data.title,
        startTime: formatDateTimeLocal(data.start_time),
        endTime: formatDateTimeLocal(data.end_time),
        focus: data.focus,
        point: data.point,
        note: data.note,
      });
      setIsLoading(false);
    };

    loadRecordData();
  }, [recordId, token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
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
      start_time: new Date(formData.startTime).toISOString(),
      end_time: new Date(formData.endTime).toISOString(),
      title: formData.title,
      note: formData.note,
      focus: formData.focus,
      point: formData.point,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/records/${recordId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.status === 200) {
        // Reset form data to initial values after successful submission
        setFormData({
          title: '',
          startTime: '',
          endTime: '',
          focus: 0,
          point: 0,
          note: '',
        });

        toast({
          title: 'Success',
          description: 'Record update successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // go to records page
      router.push('/records');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while update.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.md">
      <Heading as="h1" mb={4}>
        Update Record
      </Heading>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel htmlFor="title">Title</FormLabel>
              <Input
                id="title"
                name="title"
                type="text"
                onChange={handleChange}
                value={formData.title}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="start-time">Start Time</FormLabel>
              <Input
                id="start-time"
                name="startTime"
                type="datetime-local"
                onChange={handleChange}
                value={formData.startTime}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="end-time">End Time</FormLabel>
              <Input
                id="end-time"
                name="endTime"
                type="datetime-local"
                onChange={handleChange}
                value={formData.endTime}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Focus</FormLabel>
              <RadioGroup
                onChange={(value: string) =>
                  setFormData((prev) => ({
                    ...prev,
                    focus: parseInt(value, 10),
                  }))
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
                  setFormData((prev) => ({
                    ...prev,
                    point: parseInt(value, 10),
                  }))
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
              <FormLabel htmlFor="note">Note</FormLabel>
              <Textarea
                id="note"
                name="note"
                value={formData.note}
                onChange={handleChange}
              />
            </FormControl>
            <Button colorScheme="blue" type="submit">
              Update
            </Button>
          </Stack>
        </form>
      )}
    </Container>
  );
}
