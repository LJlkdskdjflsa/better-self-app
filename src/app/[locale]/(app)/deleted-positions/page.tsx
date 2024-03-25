'use client';

import { Flex } from '@chakra-ui/react';
import type { Resource } from 'i18next';
import { useEffect, useState } from 'react';

import initTranslations from '~/i18n';
import { useAuth } from '~/lib/components/hooks/useAuth';
import PositionsList from '~/lib/components/positions/PositionsList';
import TranslationsProvider from '~/lib/components/TranslationsProvider';

const i18nNamespaces = ['position', 'common'];

export default function PositionsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  useAuth('/position');

  // i18n
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
      <Flex justifyContent="center" height="90%">
        <PositionsList isDeleted />
      </Flex>
    </TranslationsProvider>
  );
}
