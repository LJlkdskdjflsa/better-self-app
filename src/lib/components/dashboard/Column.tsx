import { AddIcon } from '@chakra-ui/icons';
import { Badge, Box, Heading, IconButton, Stack } from '@chakra-ui/react';

import { ColumnType } from '~/utils/enumUtils';
import type { ApplicantModel } from '~/utils/models';

import ApplicantCard from './ApplicantCard';

const ColumnColorScheme: Record<ColumnType, string> = {
  履歷收集: 'gray',
  履歷審核: 'red',
  電話面試: 'orange',
  現場面試: 'yellow',
  錄取通知: 'green',
};

const mockApplicants: ApplicantModel[] = [
  {
    id: '1',
    name: 'John Doe',
    column: ColumnType.RESUME_COLLECTION,
    color: 'red',
  },
  {
    id: '2',
    name: 'Jane ssDoe',
    column: ColumnType.RESUME_COLLECTION,
    color: 'gray',
  },
  {
    id: '3',
    name: 'John sss',
    column: ColumnType.RESUME_COLLECTION,
    color: 'gray',
  },
  {
    id: '4',
    name: 'Jane Smit1h',
    column: ColumnType.RESUME_COLLECTION,
    color: 'gray',
  },
];

function Column({ column }: { column: ColumnType }) {
  const ColumnApplicants = mockApplicants.map(
    (
      applicant
      // index
    ) => {
      return (
        <ApplicantCard
          key={applicant.id}
          // index={index}
          applicant={applicant}
        />
      );
    }
  );

  return (
    <Box>
      <Heading fontSize="md" mb={4} letterSpacing="wide">
        <Badge
          px={2}
          py={1}
          rounded="lg"
          colorScheme={ColumnColorScheme[column]}
        >
          {column}
        </Badge>
      </Heading>
      <IconButton
        size="xs"
        w="full"
        color="gray.500"
        bgColor="gray.100"
        _hover={{ bgColor: 'gray.200' }}
        aria-label="Add applicant"
        icon={<AddIcon />}
      />
      <Stack
        direction={{ base: 'row', md: 'column' }}
        h={{ base: 300, md: 600 }}
        p={4}
        mt={2}
        spacing={4}
        bgColor="gray.50"
        rounded="lg"
        boxShadow="md"
        overflow="auto"
      >
        {ColumnApplicants}
      </Stack>
    </Box>
  );
}

export default Column;
