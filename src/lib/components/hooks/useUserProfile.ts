import { useQuery } from 'react-query';

import type { UserProfile } from '../domain/user/interface/UserProfile';

const fetchUserProfile = async (): Promise<UserProfile> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile/?basic=True`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export function useUserProfile() {
  return useQuery<UserProfile, Error>('userProfile', fetchUserProfile);
}
