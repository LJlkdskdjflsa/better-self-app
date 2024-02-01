export interface Company {
  id: number;
  company: string;
  domain: string;
  logo: string;
  location_lat: null | number;
  location_lon: null | number;
  location_address: null | string;
  description: string;
  employees_number: number;
  phone_number: null | string;
}

export interface Country {
  id: number;
  code2: string;
  name: string;
}

export interface State {
  id: number;
  code: string;
  name: string;
}

export interface JobPosition {
  id: number;
  job_title: string;
}

export interface Profile {
  id: number;
  emp_status: null | string;
  college: null | string;
  major: null | string;
  company: Company;
  country: Country;
  state: State;
  job_position: JobPosition;
  dob: string;
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
  profile_photo: string;
  grad_year: null | number;
  user_type: number;
}
