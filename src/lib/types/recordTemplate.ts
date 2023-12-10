export interface CreateRecordTemplateRequest {
  id: string | null;
  title: string;
  focus: number;
  point: number;
  note: string | null;
}

export interface CreateRecordTemplateRequestNew {
  title: string;
  focus: number;
  point: number;
  note: string | null;
}
export interface UpdateRecordTemplateRequest {
  default_title: string;
  default_focus: number;
  default_point: number;
  default_note: string;
}

export interface RecordTemplate {
  id: string;
  default_title: string;
  default_focus: number;
  default_point: number;
  default_note: string;
  created_at: string;
}

export interface FetchTemplatesResponse {
  total: number;
  page: number;
  size: number;
  data: RecordTemplate[];
}
