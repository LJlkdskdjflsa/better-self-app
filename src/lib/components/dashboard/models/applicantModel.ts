// Define interfaces
interface ApplicantStatus {
  id: number;
  value: string;
  icon: string | null;
  pos: number;
  rejectable: boolean;
  default: boolean;
}

interface CompanyObject {
  id: number;
  company: string;
  logo: string;
  domain: string | null;
  location_lat: number | null;
  location_lon: number | null;
  location_address: string | null;
  description: string | null;
  phone_number: string | null;
  employees_number: number | null;
}

interface Position {
  id: number;
  state: {
    id: number;
    code: string;
    name: string;
  };
  country: {
    id: number;
    code2: string;
    name: string;
  };
  company: CompanyObject;
  job: string;
  responsibilities: string;
  requirements: string;
  department: string;
  job_type: string;
  city: string;
  is_deleted: boolean;
  created_date: string;
  updated_date: string;
}

interface ApplicantModelNew {
  id: number;
  first_name: string;
  last_name: string;
  application_status: ApplicantStatus;
  position: Position;
  company_object: CompanyObject;
  apply_date: string;
  is_rejected: boolean;
  email: string | null;
  phone_number: string;
  reference: string | null;
  column: string; // temp, TODO: remove
  uuid: string;
  candidate_resume: string | null;
  application_note: string | null;
  ai_resume_score: string | null;
}

interface ApiResponse {
  success: boolean;
  error_code: number;
  error_message: string;
  data: ApplicantModelNew[];
}
interface ApplicantStatus {
  id: number;
  value: string;
  icon: null | string;
  pos: number;
  rejectable: boolean;
  default: boolean;
}

interface ColumnType {
  id: number;
  value: string;
}

interface Note {
  id: number;
  description: string;
  created_date: string;
  updated_date: string;
}

interface ApplicantBoardModel extends Record<string, ApplicantModelNew[]> {}
// export all
export type {
  ApiResponse,
  ApplicantBoardModel,
  ApplicantModelNew,
  ApplicantStatus,
  ColumnType,
  Note,
};
