import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  IconButton,
  Input,
  Spacer,
  TabPanel,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';

import type { ApplicantModelNew, Note } from '../models/applicantModel';

interface NoteTabProps {
  task: ApplicantModelNew;
}

const NoteTab: React.FC<NoteTabProps> = ({ task }) => {
  // const { notes, fetchNotes, setNotes, deleteNote } = useNotes(task.id);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const toast = useToast();

  const fetchNotes = useCallback(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/positionapps/${task.id}/notes/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setNotes(data.data);
      });
  }, [task]);

  const deleteNote = (noteID: number) => {
    // Optimistic update
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteID));

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/positionapps/${task.id}/notes/`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ jobapp_note_id: noteID }),
      }
    )
      .then((response) => response.json())
      // .then((data) => {
      //   if (data.success) {
      //   }
      // })
      .catch((error) => {
        // Handle any errors, such as network issues
        toast({
          title: '刪除失敗',
          description: (error as Error).message,
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top',
        });
        // rollback
        fetchNotes(); // Optionally, fetch notes again to ensure UI is in sync with the server
      });
  };

  useEffect(() => {
    fetchNotes();
  }, [task, fetchNotes]);

  const addNote = () => {
    const tempNote: Note = {
      id: 10000000, // Use a temporary negative ID to avoid conflicts
      description: newNote,
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
    };
    setNewNote('');

    // Optimistically add the new note to the UI
    setNotes([tempNote, ...notes]);

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/positionapps/${task.id}/notes/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ description: newNote }),
      }
    )
      .then((response) => response.json())
      .then((actualNote) =>
        // actualNote
        {
          setNotes((prevNotes) => [
            actualNote.data,
            ...prevNotes.filter((note) => note.id !== tempNote.id),
          ]);
        }
      )
      .catch(() => {
        // If the API call fails, remove the temporary note
        setNotes((prevNotes) =>
          prevNotes.filter((note) => note.id !== tempNote.id)
        );
      })
      .finally(() => {
        fetchNotes();
      });
  };

  return (
    <TabPanel>
      {notes.map((note) => (
        <Box w="100%" p={2} m={2} border="1px solid gray" borderRadius="md">
          <FormControl key={note.id}>
            <Flex>
              <Text>{note.description}</Text>
              <Spacer />
              <IconButton
                icon={<Icon as={FaTrash} />}
                colorScheme="red"
                onClick={() => deleteNote(note.id)}
                aria-label=""
              />
            </Flex>
          </FormControl>
        </Box>
      ))}

      <Box m={2}>
        <FormControl>
          <FormLabel>新增備註</FormLabel>
          <Flex w="100%">
            <Input
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <Spacer />
            <Button ml={10} onClick={addNote}>
              新增
            </Button>
          </Flex>
        </FormControl>
      </Box>
    </TabPanel>
  );
};

export default NoteTab;
