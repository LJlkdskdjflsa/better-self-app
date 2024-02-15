import { useCallback, useEffect, useState } from 'react';

import type { Note } from '../models/applicantModel';

export const useNotes = (taskID: number) => {
  const [notes, setNotes] = useState<Note[]>([]);

  const fetchNotes = useCallback(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/positionapps/${taskID}/notes/`,
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
  }, [taskID]);

  const deleteNote = useCallback(
    (noteID: number) => {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/positionapps/${taskID}/notes/`,
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
        .then((data) => {
          if (data.success) {
            fetchNotes(); // Fetch all notes again
          }
        });
    },
    [taskID, fetchNotes]
  );

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return { notes, fetchNotes, setNotes, deleteNote };
};
