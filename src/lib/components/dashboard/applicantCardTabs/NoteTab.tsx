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
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { FaTrash } from 'react-icons/fa';

import type { ApplicantModelNew, Note } from '../models/applicantModel';
import { debug } from '../utils/logging';

interface NoteTabProps {
  task: ApplicantModelNew;
}

const NoteTab: React.FC<NoteTabProps> = ({ task }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const toast = useToast();
  const { t } = useTranslation(); // Use the useTranslation hook

  //
  const pdfIframeRef = useRef<HTMLIFrameElement>(null);

  const enterFullscreen = () => {
    const elem = pdfIframeRef.current;
    if (elem && elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  };
  //

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
      .catch((error) => {
        // Handle any errors, such as network issues
        toast({
          title: t('common:delete-failed'), // Translated
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

  useEffect(() => {
    if (task.candidate_resume) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/positionapps/${task.uuid}/download_resume`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
        .then((response) => response.blob())
        .then((blob) => {
          const blobUrl = window.URL.createObjectURL(blob);
          setResumeUrl(blobUrl);
        })
        .catch((error) => debug(`Error fetching resume: ${error}`));
    }
  }, [task]);

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
      .then((actualNote) => {
        setNotes((prevNotes) => [
          actualNote.data,
          ...prevNotes.filter((note) => note.id !== tempNote.id),
        ]);
      })
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

  const downloadResume = () => {
    // Construct the URL for downloading the resume
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/positionapps/${task.uuid}/download_resume`;

    // Perform a GET request to the constructed URL
    fetch(url, {
      method: 'GET',
      headers: {
        // Include the Authorization header with the access token
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
      .then((response) => response.blob()) // Convert the response to a Blob
      .then((blob) => {
        // Create a new URL for the blob and trigger the download
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `${task.first_name}_resume`); // Set the filename for the downloaded file
        document.body.appendChild(link); // Temporarily add the link to the document
        link.click(); // Programmatically click the link to trigger the download
        document.body.removeChild(link); // Remove the link from the document safely
      })
      .catch((error) => debug(`Download error: ${error}`)); // Log any errors that occur during the download process
  };

  return (
    <TabPanel>
      <Flex mb={5} direction="column">
        {task.candidate_resume ? (
          <>
            <Box mb={4} height="500px" overflow="scroll">
              <iframe
                src={resumeUrl}
                ref={pdfIframeRef}
                // srcDoc={`${resumeUrl}`}
                scrolling="no"
                frameBorder="0"
                width="100%"
                height="100%"
                allow="autoplay"
                title="Resume"
              />
            </Box>
            <Flex gap="12px">
              <Button colorScheme="blue" onClick={downloadResume} maxW={200}>
                {t('common:download-resume')}
              </Button>
              <Button type="button" onClick={handleFullscreen}>
                {t('common:full-screen')}
              </Button>
            </Flex>
          </>
        ) : (
          <Text>{t('common:no-resume')}</Text>
        )}
      </Flex>
      {notes.map((note) => (
        <Box
          w="100%"
          p={2}
          m={2}
          border="1px solid gray"
          borderRadius="md"
          key={note.id}
        >
          <FormControl>
            <Flex>
              <Text>{note.description}</Text>
              <Spacer />
              <IconButton
                icon={<Icon as={FaTrash} />}
                colorScheme="red"
                onClick={() => deleteNote(note.id)}
                aria-label={t('common:delete')} // Translated
              />
            </Flex>
          </FormControl>
        </Box>
      ))}

      <Box m={2}>
        <FormControl mt={5}>
          <FormLabel>{t('common:create-note')}</FormLabel>
          <Flex w="100%">
            <Input
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <Spacer />
            <Button ml={10} onClick={addNote}>
              {t('common:create')} {/* Translate the button text */}
            </Button>
          </Flex>
        </FormControl>
      </Box>
    </TabPanel>
  );
};

export default NoteTab;
