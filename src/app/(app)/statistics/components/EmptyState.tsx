import { Box, Text, Icon } from '@chakra-ui/react';
import { FiInbox } from 'react-icons/fi';

/**
 * Empty state component for when no records exist
 * Implements FR-013 (empty state message)
 * From: quickstart.md section 3.1
 */
export default function EmptyState() {
  return (
    <Box textAlign="center" py={10}>
      <Icon as={FiInbox} boxSize={12} color="gray.400" mb={4} />
      <Text fontSize="lg" color="gray.600">
        No records found for the selected date range
      </Text>
      <Text fontSize="sm" color="gray.500" mt={2}>
        Try selecting a different date range or create some records
      </Text>
    </Box>
  );
}
