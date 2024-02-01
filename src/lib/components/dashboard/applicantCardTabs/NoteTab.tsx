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
import type { ApplicantModelNew } from '../models/applicanModel';

interface NoteTabProps {
  task: ApplicantModelNew;
}

const NoteTab: React.FC<NoteTabProps> = ({ task }) => {
  const { notes, fetchNotes, deleteNote } = useNotes(task.id);
  const [newNote, setNewNote] = useState('');

  const addNote = () => {
    let isCancelled = false;
    fetch(`http://127.0.0.1:8001/api/positionapps/${task.id}/notes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer AFG9JxtaRz79cjLZnhuz406uypiae6',
      },
      body: JSON.stringify({ description: newNote }),
    })
      .then((response) => response.json())
      .then(() => {
        if (!isCancelled) {
          //   console.log(data);
          fetchNotes();
          setNewNote('');
        }
      });
    return () => {
      isCancelled = true;
    };
  };

  useEffect(() => {
    fetchNotes();
  }, [task, fetchNotes]);

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
