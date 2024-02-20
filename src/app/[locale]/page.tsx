import { Flex } from '@chakra-ui/react';

import initTranslations from '~/i18n';
import LandingPage from '~/lib/components/landing/LandingPage';

export default async function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t } = await initTranslations(locale, ['landing-page']);
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      gap={4}
      mb={8}
      w="full"
    >
      <>{t('header')}</>
      <LandingPage />
    </Flex>
  );
}
