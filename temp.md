'use client';

import { Box } from '@chakra-ui/react';

import RecordList from '~/lib/components/records/RecordList';

const Register = () => {
  return (
    <Box
      // direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      gap={4}
      mb={8}
      w="full"
    >
      <RecordList />
    </Box>
  );
};

export default Register;

---

import { Box, Text, Flex, Button } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

import { fetchRecords } from '~/lib/services/api';
import type { Record } from '~/lib/types/recordTypes';
import {
  formatTimeRange,
  transferUtcTimestampToLocalTime,
} from '~/utils/timeUtils';

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
        <Box
          key={record.id}
          p={4}
          shadow="md"
          borderWidth="1px"
          width="90%" // Set the width to 90% of the screen
          my={2} // Add margin for vertical spacing between cards
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Flex direction="column">
              <Text fontWeight="bold" isTruncated>
                {record.title}
              </Text>
              <Text fontSize="sm">
                Ended at: {transferUtcTimestampToLocalTime(record.end_time)}
              </Text>
            </Flex>
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

---

import type { FetchRecordsResponse } from '../types/recordTypes';

export async function fetchRecords(
  page: number
): Promise<FetchRecordsResponse> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/records?page=${page}&size=6`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return (await response.json()) as FetchRecordsResponse;
  } catch (error) {
    return Promise.reject(error);
  }
}

---

export interface Record {
  start_time: string;
  end_time: string;
  title: string;
  note: string;
  focus: number;
  point: number;
  id: string;
  created_at: string;
}

export interface FetchRecordsResponse {
  total: number;
  page: number;
  size: number;
  data: Record[];
}

---

use above as template, create a statistics page
need to have

- pie chart of total time spent on each title
- line chart of focus and point (two lines)

over 10 records