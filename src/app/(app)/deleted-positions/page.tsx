'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { useQuery } from 'react-query';

import { useAuth } from '~/lib/components/hooks/useAuth';
import { fetchDeletedPositions } from '~/lib/components/positions/apis';
import type { Position } from '~/lib/components/positions/interfaces';
import PositionCard from '~/lib/components/positions/PositionCard';

const PositionsPage: NextPage = () => {
  useAuth('/');
  const { data: positions, isLoading } = useQuery<Position[]>(
    'deleted-positions',
    fetchDeletedPositions
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <Flex justifyContent="center" height="60%">
      <Box bg="white" p={10} mt={10} boxShadow="xl" borderRadius="lg" w="60%">
        {/* Header */}
        <Flex alignItems="center" justifyContent="space-between" mb={10}>
          <Heading as="h1" size="xl">
            職位列表
          </Heading>
        </Flex>

        {/* Positions List */}
        <Box>
          {/* @ts-expect-error: positions might be undefined */}
          {positions?.length > 0 ? (
            positions?.map((position) => (
              <PositionCard position={position} key={position.id} />
            ))
          ) : (
            <Text>目前沒有職缺</Text>
          )}
        </Box>

        {/* Pagination */}
        <Flex justifyContent="center" alignItems="center" mt={6}>
          {/* Implement actual pagination logic here */}
          <Button variant="outline" size="sm" mr={2}>
            <ChevronLeftIcon />
          </Button>
          <Text>1</Text>
          <Button variant="outline" size="sm" ml={2}>
            <ChevronRightIcon />
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default PositionsPage;
