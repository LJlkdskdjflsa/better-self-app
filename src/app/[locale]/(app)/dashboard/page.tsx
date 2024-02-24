'use client';

import {} from '@chakra-ui/icons';
import { Grid, GridItem } from '@chakra-ui/react';
import type { Resource } from 'i18next';
import { useEffect, useState } from 'react';

import initTranslations from '~/i18n';
import ChatComponent from '~/lib/components/ChatComponent';
import ApplicantTrackingPanel from '~/lib/components/dashboard/ApplicantTrackingPanel';
import { useAuth } from '~/lib/components/hooks/useAuth';

const i18nNamespaces = ['dashboard', 'common', 'position'];

export default function DashboardPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  useAuth('/');

  const [i18nResources, setI18nResources] = useState<Resource | null>(null);

  // i18n
  useEffect(() => {
    const loadResources = async () => {
      const { resources } = await initTranslations(locale, i18nNamespaces);
      setI18nResources(resources);
    };

    loadResources();
  }, [locale]);

  if (!i18nResources) {
    return <div>Loading...</div>;
  }

  return (
    <Grid templateColumns="75% 25%" w="100%" h="100%">
      <GridItem h="100%">
        <ApplicantTrackingPanel />
      </GridItem>
      <GridItem h="100%">
        <ChatComponent />
      </GridItem>
    </Grid>
  );
}
