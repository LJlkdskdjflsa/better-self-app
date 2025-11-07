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
import { useEffect, useState, useCallback } from 'react';

import { TagSelector } from '../common/TagSelector';
import { useToken } from '../hooks/useToken';
import { createRecord } from '~/lib/services/api/record';
import { fetchTags } from '~/lib/services/api/tags';
import type { CreateRecordTemplateRequest } from '~/lib/types/recordTemplate';
import type { Tag } from '~/lib/types/tag';
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
  tag_ids: string[];
}

interface NewRecordFormProps {
  formData?: FormData;
  setFormData?: (data: FormData | ((prev: FormData) => FormData)) => void;
  onRecordCreated?: () => void;
}

export default function NewRecordForm({
  formData: controlledFormData,
  setFormData: controlledSetFormData,
  onRecordCreated,
}: NewRecordFormProps = {}) {
  const toast = useToast();
  const [token] = useToken();
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [tagsLoading, setTagsLoading] = useState(false);

  // Internal form data state (for uncontrolled mode)
  const [internalFormData, setInternalFormData] = useState<FormData>({
    title: '',
    startTime: '',
    endTime: '',
    focus: 0,
    point: 0,
    note: '',
    tag_ids: [],
  });

  // Use controlled state if provided, otherwise use internal state
  const formData = controlledFormData ?? internalFormData;
  const setFormData = controlledSetFormData ?? setInternalFormData;

  // Load available tags
  const loadTags = useCallback(async () => {
    try {
      setTagsLoading(true);
      const tags = await fetchTags();
      setAvailableTags(tags);
    } catch {
      // Failed to load tags - user will see empty tag selector
    } finally {
      setTagsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  // Load template from localStorage only if NOT in controlled mode
  useEffect(() => {
    if (!controlledFormData && typeof window !== 'undefined') {
      const templateData: CreateRecordTemplateRequest = JSON.parse(
        localStorage.getItem('template') || '{}'
      );
      // Update form data with template if available
      if (templateData?.title) {
        setInternalFormData({
          title: templateData.title,
          startTime: '',
          endTime: '',
          focus: templateData.focus || 0,
          point: templateData.point || 0,
          note: templateData.note || '',
          tag_ids: templateData.tag_ids || [],
        });
      }
    }
  }, [controlledFormData]);

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
        position: 'top',
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
      tag_ids: formData.tag_ids,
    };

    try {
      await createRecord(payload);

      // Reset form data to initial values after successful submission
      toast({
        title: 'Success',
        description: 'Record created successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });

      // Clear localStorage template
      if (typeof window !== 'undefined') {
        localStorage.removeItem('template');
      }

      // Reset form only if NOT in controlled mode
      if (!controlledFormData) {
        setInternalFormData({
          title: '',
          startTime: '',
          endTime: '',
          focus: 0,
          point: 0,
          note: '',
          tag_ids: [],
        });
      }

      // Call the callback if provided (for controlled mode)
      onRecordCreated?.();
    } catch {
      toast({
        title: 'Error',
        description: 'An error occurred while submitting the form.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
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
        position: 'top',
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
          position: 'top',
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
        position: 'top',
      });
    }
  };

  // Function to set end time to start time + 1 hour
  const setEndTimeOneHourAfterStart = () => {
    if (!formData.startTime) {
      toast({
        title: 'Error',
        description: 'Please set a start time first.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    // Parse the start time (format: "HH:MM")
    const [hours, minutes] = formData.startTime.split(':').map(Number);

    // Add 1 hour
    let newHours = hours + 1;

    // Handle 24-hour rollover
    if (newHours >= 24) {
      newHours -= 24;
    }

    // Format back to HH:MM
    const endTime = `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    setFormData({ ...formData, endTime });
  };
  return (
    <Container maxW={{ base: 'container.md', md: '100%' }}>
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
              <Button onClick={setEndTimeOneHourAfterStart} ml={2}>
                1hr
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

          {/* Tag Selector */}
          <TagSelector
            availableTags={availableTags}
            selectedTagIds={formData.tag_ids}
            onChange={(selectedIds) =>
              setFormData({ ...formData, tag_ids: selectedIds })
            }
            isDisabled={tagsLoading}
          />

          <Button colorScheme="blue" type="submit">
            Submit
          </Button>
        </Stack>
      </form>
    </Container>
  );
}
