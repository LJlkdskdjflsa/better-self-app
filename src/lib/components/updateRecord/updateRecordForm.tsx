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

import { TagSelector } from '../common/TagSelector';
import { useToken } from '../hooks/useToken';
import { fetchRecordById, updateRecord } from '~/lib/services/api/record';
import { fetchTags } from '~/lib/services/api/tags';
import type { Tag as TagType } from '~/lib/types/tag';
import { formatDateTimeLocal } from '~/utils/timeUtils';

interface FormData {
  title: string;
  startTime: string;
  endTime: string;
  focus: number;
  point: number;
  note: string;
  tag_ids: string[];
}

export default function UpdateRecordForm({ recordId }: { recordId: string }) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    startTime: '',
    endTime: '',
    focus: 0,
    point: 0,
    note: '',
    tag_ids: [],
  });
  const [availableTags, setAvailableTags] = useState<TagType[]>([]);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token] = useToken();
  const toast = useToast();
  const router = useRouter();

  // T059: Load available tags
  useEffect(() => {
    const loadTags = async () => {
      try {
        setTagsLoading(true);
        const tags = await fetchTags();
        setAvailableTags(tags);
      } catch {
        // Failed to load tags - user will see empty tag selector
      } finally {
        setTagsLoading(false);
      }
    };

    loadTags();
  }, []);

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
        tag_ids: data.tags?.map((tag) => tag.id) || [],
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

    // T060: Include tag_ids in update payload
    const payload = {
      start_time: new Date(formData.startTime).toISOString(),
      end_time: new Date(formData.endTime).toISOString(),
      title: formData.title,
      note: formData.note,
      focus: formData.focus,
      point: formData.point,
      tag_ids: formData.tag_ids,
    };

    try {
      await updateRecord(recordId, payload);

      toast({
        title: 'Success',
        description: 'Record updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Go to records page
      router.push('/records');
    } catch {
      toast({
        title: 'Error',
        description: 'An error occurred while updating.',
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

            {/* T059: Tag Selector for editing */}
            <TagSelector
              availableTags={availableTags}
              selectedTagIds={formData.tag_ids}
              onChange={(selectedIds) =>
                setFormData({ ...formData, tag_ids: selectedIds })
              }
              isDisabled={tagsLoading}
            />

            <Button colorScheme="blue" type="submit">
              Update
            </Button>
          </Stack>
        </form>
      )}
    </Container>
  );
}
