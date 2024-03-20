import type { Company } from '../../company/interface/Company';

export interface UserProfile {
  id: number;
  emp_status: string | null;
  college: string | null;
  major: string | null;
  company: Company;
  country: string | null;
  state: string | null;
  job_position: string | null;
  dob: string | null;
  is_google_linked: boolean;
  is_linkedin_linked: boolean;
  username: string;
  first_name: string;
  last_name: string;
  date_joined: string;
  email: string;
  is_email_public: boolean;
  gmail_last_update_time: number;
  is_gmail_read_ok: boolean;
  signup_flow_completed: boolean;
  synching: boolean;
  gender: string;
  student_email: string;
  phone_number: string;
  profile_photo: string | null;
  grad_year: number | null;
  can_use_chat_with_ai: boolean;
  user_type: number;
}
