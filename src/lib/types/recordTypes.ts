export interface Record {
  start_time: string;
  end_time: string;
  title: string;
  note: string;
  focus: number;
  point: number;
  id: string;
  created_at: string;
}

export interface FetchRecordsResponse {
  total: number;
  page: number;
  size: number;
  data: Record[];
}
