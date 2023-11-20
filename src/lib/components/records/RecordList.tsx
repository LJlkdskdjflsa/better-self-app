import { Box, Text, Flex, Button } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

import { fetchRecords } from '~/lib/services/api';
import type { Record } from '~/lib/types/recordTypes';
import { formatTimeRange } from '~/utils/timeUtils';

export default function RecordList() {
  const [records, setRecords] = useState<Record[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const loadRecords = async () => {
      const response = await fetchRecords(page);
      if (response) {
        setRecords(response.data);
        // Assuming the API returns total records and size per page, calculate total pages
        setTotalPages(Math.ceil(response.total / response.size));
      }
    };

    loadRecords();
  }, [page]);

  // Function to handle page changes
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <Flex direction="column" alignItems="center">
      {records.map((record) => (
        <Box key={record.id} p={4} shadow="md" borderWidth="1px">
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontWeight="bold">{record.title}</Text>
            <Text>{formatTimeRange(record.start_time, record.end_time)}</Text>
          </Flex>
        </Box>
      ))}

      {/* Pagination Controls */}
      <Flex justifyContent="space-between" width="full" p={4}>
        <Button
          onClick={() => handlePageChange(page - 1)}
          isDisabled={page === 1}
        >
          Previous
        </Button>
        <Button
          onClick={() => handlePageChange(page + 1)}
          isDisabled={page === totalPages}
        >
          Next
        </Button>
      </Flex>
    </Flex>
  );
}
