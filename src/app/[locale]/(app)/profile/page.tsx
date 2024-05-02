'use client';

import { Box, Flex } from '@chakra-ui/react';

import { useAuth } from '~/lib/components/hooks/useAuth';
import ProfileTabs from '~/lib/components/profile/ProfileTabs';

export default function PersonalDataPage({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params: { locale },
}: {
  params: { locale: string };
}) {
  useAuth('/profile');

  return (
    <Flex justify="center" align="center" height="100vh">
      <Box m={5} bgColor="white" w="90%" height="700px" borderRadius="xl">
        <ProfileTabs />
      </Box>
    </Flex>
  );
}
