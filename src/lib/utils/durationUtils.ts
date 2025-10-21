import { differenceInMinutes, max, min } from 'date-fns';

/**
 * Calculate proportional duration for records spanning date boundaries
 * Implements FR-012 (cross-day splitting)
 * Source: research.md section 2
 */
export function calculateProportionalDuration(
  recordStart: Date,
  recordEnd: Date,
  rangeStart: Date,
  rangeEnd: Date
): number {
  // Determine actual intersection window
  const effectiveStart = max([recordStart, rangeStart]);
  const effectiveEnd = min([recordEnd, rangeEnd]);

  // If no intersection, return 0
  if (effectiveStart >= effectiveEnd) {
    return 0;
  }

  // Calculate duration in minutes (SC-005: minute-level accuracy)
  return differenceInMinutes(effectiveEnd, effectiveStart);
}

/**
 * Format duration in minutes to human-readable format
 * Implements FR-014 (human-readable duration)
 * Source: research.md section 7
 *
 * Examples:
 * - 0 → "0m"
 * - 45 → "45m"
 * - 90 → "1h 30m"
 * - 120 → "2h"
 */
export function formatDuration(minutes: number): string {
  if (minutes === 0) return '0m';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;

  return `${hours}h ${mins}m`;
}
