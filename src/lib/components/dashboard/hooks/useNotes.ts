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

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return { notes, fetchNotes };
};
