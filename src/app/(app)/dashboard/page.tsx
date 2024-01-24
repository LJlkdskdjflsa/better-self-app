'use client';

import { Box } from '@chakra-ui/react';

import { useAuth } from '~/lib/components/hooks/useAuth';

export default function Kanban() {
  useAuth('/');

  return <Box />;
}
