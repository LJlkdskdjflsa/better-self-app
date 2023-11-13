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
} from '@chakra-ui/react';
import { useState } from 'react';

import { formatDateAndTime } from '~/utils/dateTimeUtils';

interface FormData {
  title: string;
  startTime: string;
  endTime: string;
  focus: number;
  point: number;
  note: string;
}

export default function MainForm() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    startTime: '',
    endTime: '',
    focus: 0,
    point: 0,
    note: '',
  });
  const toast = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'focus' || name === 'point') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: parseInt(value, 10),
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

    const payload = {
      start_time: formatDateAndTime(formData.startTime),
      end_time: formatDateAndTime(formData.endTime),
      title: formData.title,
      note: formData.note,
      focus: formData.focus,
      point: formData.point,
    };

    try {
      const response = await fetch(
        'https://heavyweight-fastapi-production-1c7c.up.railway.app/records',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.status === 201) {
        // const responseData = await response.json();
        toast({
          title: 'Success',
          description: 'Record created successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
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
  return (
    <Container maxW="container.md">
      <Heading as="h1" mb={4}>
        BetterSelf
      </Heading>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input
              id="title"
              name="title"
              type="text"
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="start-time">Start Time</FormLabel>
            <Input
              id="start-time"
              name="startTime"
              type="time"
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="end-time">End Time</FormLabel>
            <Input
              id="end-time"
              name="endTime"
              type="time"
              onChange={handleChange}
            />
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
            <FormLabel htmlFor="note">Note</FormLabel>
            <Textarea id="note" name="note" onChange={handleChange} />
          </FormControl>
          <Button colorScheme="blue" type="submit">
            Submit
          </Button>
        </Stack>
      </form>
    </Container>
  );
}
