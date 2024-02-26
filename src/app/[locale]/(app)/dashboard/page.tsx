'use client';

import {} from '@chakra-ui/icons';
import { Grid, GridItem } from '@chakra-ui/react';
import type { Resource } from 'i18next';
import { useEffect, useState } from 'react';

import initTranslations from '~/i18n';
import ChatComponent from '~/lib/components/ChatComponent';
import ApplicantTrackingPanel from '~/lib/components/dashboard/ApplicantTrackingPanel';
import type { UserProfile } from '~/lib/components/domain/user/interface/UserProfile';
import { useAuth } from '~/lib/components/hooks/useAuth';

const i18nNamespaces = ['dashboard', 'common', 'position'];

export default function DashboardPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  useAuth('/');

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [i18nResources, setI18nResources] = useState<Resource | null>(null);

  // i18n
  useEffect(() => {
    const loadResources = async () => {
      const { resources } = await initTranslations(locale, i18nNamespaces);
      setI18nResources(resources);
    };

    loadResources();
  }, [locale]);

  // fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile/?basic=True`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      const data = await response.json();
      setUserProfile(data.data);
    };

    fetchUserProfile();
  }, []);

  if (!i18nResources) {
    return <div>Loading...</div>;
  }

  const showChatComponent = userProfile?.can_use_chat_with_ai || false;

  return (
    <Grid
      templateColumns={showChatComponent ? '75% 25%' : '100%'}
      w="100%"
      h="100%"
    >
      <GridItem h="100%">
        <ApplicantTrackingPanel />
      </GridItem>
      {showChatComponent && (
        <GridItem h="100%">
          <ChatComponent />
        </GridItem>
      )}
    </Grid>
  );
}
