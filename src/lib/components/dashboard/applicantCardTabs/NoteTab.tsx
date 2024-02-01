import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  TabPanel,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import type { ApplicantModelNew } from '../model';

interface NoteTabProps {
  task: ApplicantModelNew;
}

interface Note {
  id: number;
  description: string;
  created_date: string;
  updated_date: string;
}
const NoteTab: React.FC<NoteTabProps> = ({ task }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    let isCancelled = false;

    fetch(`http://127.0.0.1:8001/api/positionapps/${task.id}/notes/`, {
      headers: {
        Authorization: 'Bearer AFG9JxtaRz79cjLZnhuz406uypiae6',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!isCancelled) {
          setNotes(data.data);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [task]);

  return (
    <TabPanel>
      {notes.map((note) => (
        <Box w="100%">
          <FormControl key={note.id}>
            <Flex>
              <Text>{note.description}</Text>
              <Text>{note.created_date}</Text>
            </Flex>
          </FormControl>
        </Box>
      ))}

      <FormControl>
        <FormLabel>新增備註</FormLabel>
        <Input value={newNote} onChange={(e) => setNewNote(e.target.value)} />
        {/* <Button onClick={addNote}>新增</Button> */}
      </FormControl>
    </TabPanel>
  );
};

export default NoteTab;
