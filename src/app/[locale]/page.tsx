import { Flex, Spacer } from '@chakra-ui/react';

import initTranslations from '~/i18n';
import LandingPage from '~/lib/components/landing/LandingPage';
import LanguageChanger from '~/lib/components/LanguageChanger';
import TranslationsProvider from '~/lib/components/TranslationsProvider';

const i18nNamespaces = ['landing-page'];

export default async function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { resources } = await initTranslations(locale, ['landing-page']);
  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <Flex p={5}>
        <Spacer />
        <LanguageChanger />
      </Flex>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        minHeight="70vh"
        gap={4}
        mb={8}
        w="full"
      >
        <LandingPage />
      </Flex>
    </TranslationsProvider>
  );
}
