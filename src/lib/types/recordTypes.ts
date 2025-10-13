import type { Tag } from './tag';

export interface Record {
  start_time: string;
  end_time: string;
  title: string;
  note: string;
  focus: number;
  point: number;
  id: string;
  created_at: string;
  tags: Tag[];
}

export interface RecordCreateRequest {
  start_time: string;
  end_time: string;
  title: string;
  note?: string;
  focus: number;
  point: number;
  tag_ids?: string[];
}

export interface RecordUpdateRequest {
  start_time?: string;
  end_time?: string;
  title?: string;
  note?: string;
  focus?: number;
  point?: number;
  tag_ids?: string[];
}

export interface FetchRecordsResponse {
  total: number;
  page: number;
  size: number;
  data: Record[];
}
