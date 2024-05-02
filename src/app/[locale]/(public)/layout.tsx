import { Box, Flex } from '@chakra-ui/react';

import initTranslations from '~/i18n';
import TranslationsProvider from '~/lib/components/TranslationsProvider';
import AuthNav from '~/lib/layout/auth/AuthNav';

type RootLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

const i18nNamespaces = ['common'];
const RootLayout = async ({
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
      <Flex direction="column" minH="100vh">
        <AuthNav />
        <Box flex="1" w="100%" bg="gray.100">
          {children}
        </Box>
      </Flex>
    </TranslationsProvider>
  );
};

export default RootLayout;
