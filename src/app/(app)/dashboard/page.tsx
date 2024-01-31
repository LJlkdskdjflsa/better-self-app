'use client';

import {} from '@chakra-ui/icons';
import { Container, SimpleGrid } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Column from '~/lib/components/dashboard/Column';
import type { ApplicantStatus } from '~/lib/components/dashboard/model';

function App() {
  const [columnType, setColumnType] = useState([]);

  useEffect(() => {
    const fetchColumnType = async () => {
      const response = await axios.get(
        'http://127.0.0.1:8001/api/positionapps/statuses/',
        {
          headers: {
            Authorization: 'Bearer AFG9JxtaRz79cjLZnhuz406uypiae6',
          },
        }
      );

      if (response.data.success) {
        setColumnType(response.data.data.map((item: ApplicantStatus) => item));
      }
    };

    fetchColumnType();
  }, []);

  return (
    <main>
      <DndProvider backend={HTML5Backend}>
        <Container maxWidth="container.lg" px={4} py={10}>
          <SimpleGrid
            columns={{ base: 1, md: 4 }}
            spacing={{ base: 16, md: 4 }}
          >
            {columnType.map((type) => (
              <Column key={type} column={type} />
            ))}
          </SimpleGrid>
        </Container>
      </DndProvider>
    </main>
  );
}

export default App;
