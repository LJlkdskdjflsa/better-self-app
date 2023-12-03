export interface RecordTemplate {
  title: string;
  focus: number;
  point: number;
  note: string | null;
}

export interface RecordTemplateResponse {
  default_title: string;
  default_focus: number;
  default_point: number;
  default_note: string;
  id: string;
  created_at: string;
}

export interface FetchTemplatesResponse {
  total: number;
  page: number;
  size: number;
  data: RecordTemplateResponse[];
}
