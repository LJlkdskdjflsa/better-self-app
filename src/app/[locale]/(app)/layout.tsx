'use client';

import { Box } from '@chakra-ui/react';
import type { Resource } from 'i18next';
import { useEffect, useState } from 'react';

import initTranslations from '~/i18n';
import AppLayout from '~/lib/layout/app';

type RootLayoutProps = {
  children: React.ReactNode;
};

const i18nNamespaces = ['common'];

const AppRootLayout = ({ children }: RootLayoutProps) => {
  const currentUrl = window.location.href;
  // TODO: check if the url has a locale
  const locale = currentUrl.split('/')[3];

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
    <AppLayout>
      <main>
        <div style={{ width: '100vw', height: '92vh', overflow: 'hidden' }}>
          <Box m="2.5vh 2.5vw" w="95vw" h="95vh">
            {children}
          </Box>
        </div>
      </main>
    </AppLayout>
  );
};

export default AppRootLayout;
