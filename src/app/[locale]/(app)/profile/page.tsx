'use client';

import { Box, Flex } from '@chakra-ui/react';
import type { Resource } from 'i18next';
import { useEffect, useState } from 'react';

import initTranslations from '~/i18n';
import { useAuth } from '~/lib/components/hooks/useAuth';
import ProfileTabs from '~/lib/components/profile/ProfileTabs';
import TranslationsProvider from '~/lib/components/TranslationsProvider';

const i18nNamespaces = ['profile'];

export default function PersonalDataPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  useAuth('/profile');

  const [i18nResources, setI18nResources] = useState<Resource | null>(null);

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
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={i18nResources}
    >
      <Flex justify="center" align="center" height="100vh">
        <Box m={5} bgColor="white" w="90%" height="700px" borderRadius="xl">
          <ProfileTabs />
        </Box>
      </Flex>
    </TranslationsProvider>
  );
}
