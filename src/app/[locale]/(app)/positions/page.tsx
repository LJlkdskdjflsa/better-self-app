'use client';

import { Flex } from '@chakra-ui/react';

import { useAuth } from '~/lib/components/hooks/useAuth';
import PositionsList from '~/lib/components/positions/PositionsList';

export default function PositionsPage({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params: { locale },
}: {
  params: { locale: string };
}) {
  useAuth('/position');

  return (
    <Flex justifyContent="center" height="90%">
      <PositionsList isDeleted={false} />
    </Flex>
  );
}
