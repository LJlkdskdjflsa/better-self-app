import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subWeeks,
  subMonths,
  startOfDay,
  endOfDay,
  formatISO,
} from 'date-fns';

import type { DateRange, DateRangeTemplate } from '~/types/statistics';

/**
 * Calculate date range boundaries for predefined templates
 * Implements FR-007, FR-008, FR-009, FR-010
 * Source: research.md section 6
 */
export function calculateDateRange(
  template: DateRangeTemplate,
  customStart?: Date,
  customEnd?: Date
): DateRange {
  const now = new Date();

  switch (template) {
    case 'Today':
      return {
        start: startOfDay(now),
        end: endOfDay(now),
      };

    case 'This Week': // FR-007: Sunday to Saturday
      return {
        start: startOfWeek(now, { weekStartsOn: 0 }),
        end: endOfWeek(now, { weekStartsOn: 0 }),
      };

    case 'Last Week': {
      // FR-008: Two Sundays ago to last Saturday
      const lastWeekDate = subWeeks(now, 1);
      return {
        start: startOfWeek(lastWeekDate, { weekStartsOn: 0 }),
        end: endOfWeek(lastWeekDate, { weekStartsOn: 0 }),
      };
    }

    case 'This Month': // FR-009: 1st of month to today
      return {
        start: startOfMonth(now),
        end: endOfDay(now),
      };

    case 'Last Month': {
      // FR-010: Entire previous calendar month
      const lastMonthDate = subMonths(now, 1);
      return {
        start: startOfMonth(lastMonthDate),
        end: endOfMonth(lastMonthDate),
      };
    }

    case 'Custom':
      if (!customStart || !customEnd) {
        throw new Error('Custom date range requires both start and end dates');
      }
      return {
        start: startOfDay(customStart),
        end: endOfDay(customEnd),
      };

    default:
      throw new Error(`Unknown date range template: ${template}`);
  }
}

/**
 * Format Date object to ISO date string for API
 * Format: YYYY-MM-DD
 */
export function formatDateForAPI(date: Date): string {
  return formatISO(date, { representation: 'date' });
}
