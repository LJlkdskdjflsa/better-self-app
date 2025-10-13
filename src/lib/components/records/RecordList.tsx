import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Text,
  Flex,
  Button,
  Link,
  Spacer,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

import { deleteRecord, fetchRecords } from '~/lib/services/api/record';
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
      const response = await fetchRecords(page, 6);
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
      {records.map((currentRecord) => {
        // T058: Handle truncation - show first 3 tags + "and X more"
        const visibleTags = currentRecord.tags?.slice(0, 3) || [];
        const remainingCount =
          (currentRecord.tags?.length || 0) - visibleTags.length;

        return (
          <Box
            key={currentRecord.id}
            p={4}
            shadow="md"
            borderWidth="1px"
            width="90%" // Set the width to 90% of the screen
            my={2} // Add margin for vertical spacing between cards
          >
            <Flex justifyContent="space-between" alignItems="center">
              <Flex direction="column" flex="1" mr={4}>
                <Text fontWeight="bold" isTruncated>
                  {currentRecord.title}
                </Text>
                <Text fontSize="sm">
                  Ended at:{' '}
                  {transferUtcTimestampToLocalTime(currentRecord.end_time)}
                </Text>

                {/* T056: Display tags */}
                {currentRecord.tags && currentRecord.tags.length > 0 && (
                  <Wrap mt={2} spacing={1}>
                    {visibleTags.map((tag) => (
                      <WrapItem key={tag.id}>
                        <Tag size="sm" colorScheme="blue" borderRadius="full">
                          <TagLabel>{tag.name}</TagLabel>
                        </Tag>
                      </WrapItem>
                    ))}
                    {remainingCount > 0 && (
                      <WrapItem>
                        <Tag size="sm" colorScheme="gray" borderRadius="full">
                          <TagLabel>+{remainingCount} more</TagLabel>
                        </Tag>
                      </WrapItem>
                    )}
                  </Wrap>
                )}
              </Flex>
              <Spacer />
              <Text>
                {formatTimeRange(
                  currentRecord.start_time,
                  currentRecord.end_time
                )}
              </Text>
              <Link href={`/record/${currentRecord.id}`}>
                <Button
                  as="a"
                  variant="ghost"
                  colorScheme="blue"
                  mr={2}
                  aria-label="Update record"
                >
                  <EditIcon />
                </Button>
              </Link>
              <Button
                variant="ghost"
                colorScheme="red"
                onClick={() => {
                  deleteRecord(currentRecord.id);
                  setRecords(
                    records.filter((record) => record.id !== currentRecord.id)
                  );
                }}
                aria-label="Delete record"
              >
                <DeleteIcon />
              </Button>
            </Flex>
          </Box>
        );
      })}

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
