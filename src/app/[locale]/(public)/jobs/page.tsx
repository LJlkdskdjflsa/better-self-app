'use client';

import { Box } from '@chakra-ui/react';
import type { Resource } from 'i18next';
import { useEffect, useState } from 'react';

import initTranslations from '~/i18n';

const i18nNamespaces = ['signin'];

export default function Signin({
  params: { locale },
}: {
  params: { locale: string };
}) {
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

  return <Box />;
}
