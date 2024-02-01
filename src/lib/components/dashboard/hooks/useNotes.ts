import { useCallback, useEffect, useState } from 'react';

import type { Note } from '../model';

export const useNotes = (taskID: number) => {
  const [notes, setNotes] = useState<Note[]>([]);

  const fetchNotes = useCallback(() => {
    fetch(`http://127.0.0.1:8001/api/positionapps/${taskID}/notes/`, {
      headers: {
        Authorization: 'Bearer AFG9JxtaRz79cjLZnhuz406uypiae6',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNotes(data.data);
      });
  }, [taskID]);

  const deleteNote = useCallback(
    (noteID: number) => {
      fetch(`http://127.0.0.1:8001/api/positionapps/${taskID}/notes/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer AFG9JxtaRz79cjLZnhuz406uypiae6',
        },
        body: JSON.stringify({ jobapp_note_id: noteID }),
      })
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

  return { notes, fetchNotes, deleteNote };
};
