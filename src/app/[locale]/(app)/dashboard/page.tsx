'use client';

import {} from '@chakra-ui/icons';
import { Grid, GridItem } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import ChatComponent from '~/lib/components/ChatComponent';
import ApplicantTrackingPanel from '~/lib/components/dashboard/ApplicantTrackingPanel';
import { useAuth } from '~/lib/components/hooks/useAuth';
import { useUserProfile } from '~/lib/components/hooks/useUserProfile';

export default function DashboardPage() {
  useAuth('/');

  const { profile: userProfile, isLoading } = useUserProfile();
  const { t } = useTranslation('common');

  if (isLoading) {
    return <div>{t('loading')}</div>;
  }

  const showChatComponent = userProfile?.can_use_chat_with_ai || false;

  return (
    <Grid
      templateColumns={showChatComponent ? '75% 25%' : '100%'}
      w="100%"
      h="95vh"
      // maxH="80vh"
    >
      <GridItem h="100%" w="100%">
        <ApplicantTrackingPanel />
      </GridItem>
      {showChatComponent && (
        <GridItem h="100%" w="100%">
          <ChatComponent />
        </GridItem>
      )}
    </Grid>
  );
}
