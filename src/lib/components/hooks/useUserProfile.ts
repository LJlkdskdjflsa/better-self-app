import { useState, useEffect } from 'react';

import type { UserProfile } from '../domain/user/interface/UserProfile';
import { queryClient } from '~/app/providers';

const fetchUserProfile = async (): Promise<UserProfile> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile/`,
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

  const data = await response.json();
  return data.data;
};

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Attempt to get the cached data
        let cachedData = queryClient.getQueryData<UserProfile>('userProfile');

        if (!cachedData) {
          // If not in cache, fetch it and then update the cache
          cachedData = await fetchUserProfile();
          queryClient.setQueryData('userProfile', cachedData);
        }

        setProfile(cachedData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { profile, isLoading, error };
}
