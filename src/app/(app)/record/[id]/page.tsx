'use client';

import { Flex } from '@chakra-ui/react';

import { useAuth } from '~/lib/components/hooks/useAuth';
import UpdateRecordForm from '~/lib/components/updateRecord/updateRecordForm';

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
      <UpdateRecordForm recordId={params.id} />
    </Flex>
  );
};

export default RecordDetail;
