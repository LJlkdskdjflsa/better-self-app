'use client';

import {} from '@chakra-ui/icons';
import { Container, SimpleGrid } from '@chakra-ui/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Column from '~/lib/components/dashboard/Column';

function App() {
  const columnType = ['Todo', 'In Progress', 'Blocked', 'Completed'];

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
