import { Box } from '@chakra-ui/react';

import initTranslations from '~/i18n';
import TranslationsProvider from '~/lib/components/TranslationsProvider';
import AppLayout from '~/lib/layout/app';

type RootLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

const i18nNamespaces = ['common'];

const AppRootLayout = async ({
  children,
  params: { locale },
}: RootLayoutProps) => {
  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <AppLayout>
        <main>
          <div style={{ width: '100vw', height: '92vh', overflow: 'hidden' }}>
            <Box m="2.5vh 2.5vw" w="95vw" h="95vh">
              {children}
            </Box>
          </div>
        </main>
      </AppLayout>
    </TranslationsProvider>
  );
};

export default AppRootLayout;
