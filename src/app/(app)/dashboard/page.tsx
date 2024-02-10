'use client';

import {} from '@chakra-ui/icons';
import { Container, SimpleGrid } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Column from '~/lib/components/dashboard/Column';
import type { ApplicantStatus } from '~/lib/components/dashboard/models/applicanModel';
import { useAuth } from '~/lib/components/hooks/useAuth';
import useApplicantsStore from '~/lib/store/applicantsStore';

function App() {
  useAuth('/');
  const [columnType, setColumnType] = useState([]);
  const { applicants, fetchApplicants } = useApplicantsStore((state) => ({
    applicants: state.applicants,
    fetchApplicants: state.getApplicantsFromApi,
  }));

  useEffect(() => {
    if (!applicants) fetchApplicants();
  }, [applicants, fetchApplicants]);

  useEffect(() => {
    const fetchColumnType = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/positionapps/statuses/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
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
            columns={{ base: 1, md: 5 }}
            spacing={{ base: 16, md: 5 }}
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
