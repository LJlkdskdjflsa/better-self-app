'use client';

import {
  Box,
  Container,
  Heading,
  VStack,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

import { fetchRecordsForStatistics } from '~/lib/services/api/record';
import { calculateDateRange, formatDateForAPI } from '~/lib/utils/dateUtils';
import type { Record, TagTimeAllocation } from '~/types/statistics';

import EmptyState from './components/EmptyState';
import TagPieChart from './components/TagPieChart';
import { useRecordAggregation } from './hooks/useRecordAggregation';

/**
 * Statistics page - displays tag-based time allocation
 * Implements User Story 1 (P1): View Time Allocation by Tag
 *
 * Features in this MVP version:
 * - Pie chart showing tag time allocation (FR-004)
 * - "Today" date range (default, FR-005 partial)
 * - Empty state handling (FR-013)
 * - Loading and error states
 * - JWT authentication (FR-022)
 *
 * Future enhancements (other user stories):
 * - Date range templates and custom selection (US3)
 * - Desktop layout optimization (US2)
 * - Drill-down modals (US4)
 */
export default function StatisticsPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Phase 3: US1 - Fixed "Today" date range (US3 will add selector)
  const dateRange = calculateDateRange('Today');
  const statistics = useRecordAggregation(records, dateRange);

  useEffect(() => {
    async function loadRecords() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchRecordsForStatistics(
          formatDateForAPI(dateRange.start),
          formatDateForAPI(dateRange.end)
        );
        setRecords(data);
      } catch (err) {
        setError('Failed to load statistics. Please try again.');
        // eslint-disable-next-line no-console
        console.error('Error fetching records:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // US3 will add dateRange dependency

  // Placeholder click handler (US4 will implement drill-down)
  const handleTagClick = (tag: TagTimeAllocation) => {
    // eslint-disable-next-line no-console
    console.log('Tag clicked:', tag.tagName);
    // US4 will implement drill-down modal
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Statistics</Heading>

        {/* US3 will add DateRangeSelector here */}

        {isLoading && (
          <Box textAlign="center" py={10}>
            <Spinner size="xl" />
          </Box>
        )}

        {error && (
          <Box textAlign="center" py={10}>
            <Text color="red.500">{error}</Text>
          </Box>
        )}

        {!isLoading && !error && !statistics && <EmptyState />}

        {!isLoading && !error && statistics && (
          <TagPieChart
            data={
              [
                ...statistics.topTags,
                statistics.othersCategory,
                statistics.untaggedCategory,
              ].filter(Boolean) as TagTimeAllocation[]
            }
            onTagClick={handleTagClick}
          />
        )}
      </VStack>
    </Container>
  );
}
