import type { UserType } from './UserType';

export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  profile_photo: string | null;
  date_joined: string;
  is_admin: boolean;
  user_type: UserType;
  signup_flow_completed: boolean;
  can_use_chat_with_ai: boolean;
}
