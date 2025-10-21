/**
 * TypeScript interfaces for statistics feature
 * Source: specs/003-renew-statistics-page/data-model.md
 */

// API Response Types
export interface Tag {
  id: string;
  user_id: string;
  name: string;
  color?: string; // Hex color code
  created_at: string;
  updated_at: string;
}

export interface Record {
  id: string;
  user_id: string;
  title: string;
  start_time: string; // ISO 8601 datetime
  end_time: string; // ISO 8601 datetime
  focus?: number;
  point?: number;
  tags: Tag[];
  created_at: string;
  updated_at: string;
}

// Date Range Types
export interface DateRange {
  start: Date;
  end: Date;
}

export type DateRangeTemplate =
  | 'Today'
  | 'This Week'
  | 'Last Week'
  | 'This Month'
  | 'Last Month'
  | 'Custom';

// Aggregated Statistics Types
export interface TagTimeAllocation {
  tagId: string;
  tagName: string;
  tagColor?: string;
  totalDuration: number; // Total minutes
  percentage: number; // 0-100
  recordCount: number;
  records?: Record[]; // Lazy-loaded
}

export interface AggregatedStatistics {
  dateRange: DateRange;
  totalRecords: number;
  totalDuration: number; // Total minutes
  topTags: TagTimeAllocation[]; // Top 10
  othersCategory?: TagTimeAllocation;
  untaggedCategory?: TagTimeAllocation;
}
