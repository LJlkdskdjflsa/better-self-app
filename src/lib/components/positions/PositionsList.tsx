import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Flex, Button, Text, Heading } from '@chakra-ui/react';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import {
  fetchDeletedPositions,
  fetchPositions,
} from '~/lib/components/positions/apis'; // Adjust import as necessary
import type { Position } from '~/lib/components/positions/interfaces';
import PositionCard from '~/lib/components/positions/PositionCard';

interface PositionsListProps {
  isDeleted: boolean; // New prop to determine which positions to fetch
}

const PositionsList: React.FC<PositionsListProps> = ({ isDeleted }) => {
  const fetchFunction = isDeleted ? fetchDeletedPositions : fetchPositions;
  const { t } = useTranslation();

  const {
    data: positions,
    isLoading,
    isError,
  } = useQuery<Position[], Error>(
    ['positions', { isDeleted }], // Ensure the query key is unique for each state
    () => fetchFunction()
  );

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error loading positions.</Text>;

  return (
    <Box bg="white" p={10} mt={10} boxShadow="xl" borderRadius="lg" w="60%">
      {/* Header */}
      <Flex alignItems="center" justifyContent="space-between" mb={10}>
        <Heading as="h1" size="xl">
          {t('position-list')}
        </Heading>
      </Flex>

      {/* Positions List */}
      <Box>
        {positions && positions.length > 0 ? (
          positions.map((position) => (
            <PositionCard position={position} key={position.id} />
          ))
        ) : (
          <Text>{t('position-list-empty')} </Text>
        )}
      </Box>

      {/* Pagination (Implement as needed) */}
      <Flex justifyContent="center" alignItems="center" mt={6}>
        <Button variant="outline" size="sm" mr={2}>
          <ChevronLeftIcon />
        </Button>
        <Text>1</Text>
        <Button variant="outline" size="sm" ml={2}>
          <ChevronRightIcon />
        </Button>
      </Flex>
    </Box>
  );
};

export default PositionsList;
