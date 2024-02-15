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
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';

import { useNotes } from '../hooks/useNotes';
import type { ApplicantModelNew, Note } from '../models/applicantModel';

interface NoteTabProps {
  task: ApplicantModelNew;
}

const NoteTab: React.FC<NoteTabProps> = ({ task }) => {
  const { notes, fetchNotes, setNotes, deleteNote } = useNotes(task.id);
  const [newNote, setNewNote] = useState('');

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
      .then(() =>
        // actualNote
        {
          // setNotes((prevNotes) => [
          //   ...prevNotes.filter((note) => note.id !== tempNote.id),
          //   actualNote.data,
          // ]);
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

  useEffect(() => {
    fetchNotes();
  });

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
