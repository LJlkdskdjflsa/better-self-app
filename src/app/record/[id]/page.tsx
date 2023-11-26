'use client';

import { Flex } from '@chakra-ui/react';

import { useAuth } from '~/lib/components/hooks/useAuth';
import RecordForm from '~/lib/components/record/RecordForm';

const RecordDetail = ({ params }: { params: { id: string } }) => {
  useAuth('/');
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      gap={4}
      mb={8}
      w="full"
    >
      <RecordForm recordId={params.id} />
    </Flex>
  );
};

export default RecordDetail;
