import type { Tag } from './tag';

export interface CreateRecordTemplateRequest {
  id: string | null;
  title: string;
  focus: number;
  point: number;
  note: string | null;
  tag_ids?: string[];
}

export interface CreateRecordTemplateRequestNew {
  title: string;
  focus: number;
  point: number;
  note: string | null;
  tag_ids?: string[];
}

export interface UpdateRecordTemplateRequest {
  default_title: string;
  default_focus: number;
  default_point: number;
  default_note: string;
  tag_ids?: string[];
}

export interface RecordTemplate {
  id: string;
  default_title: string;
  default_focus: number;
  default_point: number;
  default_note: string;
  created_at: string;
  tags: Tag[];
}

export interface FetchTemplatesResponse {
  total: number;
  page: number;
  size: number;
  data: RecordTemplate[];
}
