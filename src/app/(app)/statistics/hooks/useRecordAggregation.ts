import { useMemo } from 'react';

import { calculateProportionalDuration } from '~/lib/utils/durationUtils';
import type {
  Record,
  DateRange,
  AggregatedStatistics,
  TagTimeAllocation,
} from '~/types/statistics';

/**
 * Aggregate records by tag with client-side processing
 * Implements FR-001, FR-002, FR-003, FR-011, FR-012, FR-017, FR-020, FR-021
 * Performance: Memoized for <2s with 10k records (SC-002, SC-006)
 */
export function useRecordAggregation(
  records: Record[],
  dateRange: DateRange
): AggregatedStatistics | null {
  return useMemo(() => {
    // Filter out records with missing times (FR-020)
    const validRecords = records.filter((r) => r.start_time && r.end_time);

    if (validRecords.length === 0) {
      return null; // Trigger empty state (FR-013)
    }

    // Track tag aggregations
    const tagMap = new Map<
      string,
      {
        duration: number;
        records: Record[];
        name: string;
        color?: string;
      }
    >();

    let totalDuration = 0;
    const untaggedRecords: Record[] = [];

    // Aggregate durations by tag (FR-001, FR-002, FR-003)
    // Using forEach instead of for-of to comply with linting rules
    validRecords.forEach((record) => {
      const recordStart = new Date(record.start_time);
      const recordEnd = new Date(record.end_time);
      const duration = calculateProportionalDuration(
        recordStart,
        recordEnd,
        dateRange.start,
        dateRange.end
      ); // FR-012: Cross-day splitting

      if (duration === 0) return; // Record outside date range (using return instead of continue)

      totalDuration += duration;

      // Handle untagged records (FR-017)
      if (record.tags.length === 0) {
        untaggedRecords.push(record);
      } else {
        // Multi-tagged records: count toward each tag (FR-003)
        record.tags.forEach((tag) => {
          const existing = tagMap.get(tag.id);
          if (existing) {
            existing.duration += duration;
            existing.records.push(record);
          } else {
            tagMap.set(tag.id, {
              duration,
              records: [record],
              name: tag.name,
              color: tag.color,
            });
          }
        });
      }
    });

    // Sort tags by duration descending
    const sortedTags = Array.from(tagMap.entries())
      .map(([tagId, data]) => ({
        tagId,
        tagName: data.name,
        tagColor: data.color,
        totalDuration: data.duration,
        percentage: (data.duration / totalDuration) * 100,
        recordCount: data.records.length,
        records: data.records,
      }))
      .sort((a, b) => b.totalDuration - a.totalDuration);

    // Split into top 10 and others (FR-021)
    const topTags = sortedTags.slice(0, 10);
    const othersTags = sortedTags.slice(10);

    // Create "Others" category if needed
    const othersCategory: TagTimeAllocation | undefined =
      othersTags.length > 0
        ? {
            tagId: 'others',
            tagName: 'Others',
            totalDuration: othersTags.reduce(
              (sum, tag) => sum + tag.totalDuration,
              0
            ),
            percentage: othersTags.reduce(
              (sum, tag) => sum + tag.percentage,
              0
            ),
            recordCount: othersTags.reduce(
              (sum, tag) => sum + tag.recordCount,
              0
            ),
            records: othersTags.flatMap((tag) => tag.records || []),
          }
        : undefined;

    // Create "Untagged" category if needed (FR-017)
    const untaggedCategory: TagTimeAllocation | undefined =
      untaggedRecords.length > 0
        ? {
            tagId: 'untagged',
            tagName: 'Untagged',
            totalDuration: untaggedRecords.reduce((sum, r) => {
              const start = new Date(r.start_time);
              const end = new Date(r.end_time);
              return (
                sum +
                calculateProportionalDuration(
                  start,
                  end,
                  dateRange.start,
                  dateRange.end
                )
              );
            }, 0),
            percentage: 0, // Calculated later if needed
            recordCount: untaggedRecords.length,
            records: untaggedRecords,
          }
        : undefined;

    return {
      dateRange,
      totalRecords: validRecords.length,
      totalDuration,
      topTags,
      othersCategory,
      untaggedCategory,
    };
  }, [records, dateRange]); // Memoized for performance (SC-002)
}
