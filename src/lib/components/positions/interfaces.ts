export interface Position {
  id: number;
  job: string;
  job_type: string;
  department: string;
  created_date: string;
  company: {
    id: number;
    company: string;
  };
  state: {
    id: number;
  };
  country: {
    id: number;
  };
  city: string;
  is_deleted: boolean;
  responsibilities: string;
  requirements: string;
  uuid: string;
}
