import { Center, Container, SimpleGrid, Spinner } from '@chakra-ui/react'; // Import Spinner and Center for loading indicator
import axios from 'axios';
import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Column from '~/lib/components/dashboard/Column';
import type { ApplicantStatus } from '~/lib/components/dashboard/models/applicantModel';
import useApplicantsStore from '~/lib/store/applicantsStore'; // Import the store hook

const ApplicantTrackingPanel = () => {
  const [columnType, setColumnType] = useState<ApplicantStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state
  const { applicants, fetchApplicants } = useApplicantsStore((state) => ({
    applicants: state.applicants,
    fetchApplicants: state.getApplicantsFromApi,
  }));

  useEffect(() => {
    if (!applicants) {
      fetchApplicants();
    } else {
      // Check if applicants are loaded to update loading state
      setIsLoading(false);
    }
  }, [applicants, fetchApplicants]);

  useEffect(() => {
    const fetchColumnType = async () => {
      if (localStorage.getItem('accessToken')) {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/positionapps/statuses/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        );

        if (response.data.success) {
          setColumnType(
            response.data.data.map((item: ApplicantStatus) => item)
          );
          // Check if columnType is loaded to update loading state
          setIsLoading(false);
        }
      }
    };

    fetchColumnType();
  }, []);

  if (columnType.length === 0 || isLoading) {
    return (
      <Center h="100%">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Container maxWidth="container.lg" px={4} py={10} h="100%">
        <SimpleGrid
          columns={{ base: 1, md: 5 }}
          spacing={{ base: 16, md: 5 }}
          h="100%"
        >
          {columnType.map((type) => (
            <Column key={type.id} column={type} />
          ))}
        </SimpleGrid>
      </Container>
    </DndProvider>
  );
};

export default ApplicantTrackingPanel;
