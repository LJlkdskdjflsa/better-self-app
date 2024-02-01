import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  TabPanel,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { useNotes } from '../hooks/useNotes';
import type { ApplicantModelNew } from '../model';

interface NoteTabProps {
  task: ApplicantModelNew;
}

const NoteTab: React.FC<NoteTabProps> = ({ task }) => {
  const { notes, fetchNotes } = useNotes(task.id);
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
        <Box w="100%">
          <FormControl key={note.id}>
            <Flex>
              <Text>{note.description}</Text>
              {/* <Text>{note.created_date}</Text> */}
            </Flex>
          </FormControl>
        </Box>
      ))}

      <FormControl>
        <FormLabel>新增備註</FormLabel>
        <Input value={newNote} onChange={(e) => setNewNote(e.target.value)} />
        <Button onClick={addNote}>新增</Button>
      </FormControl>
    </TabPanel>
  );
};

export default NoteTab;
