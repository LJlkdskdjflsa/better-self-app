'use client';

import { Box, Container, Heading, SimpleGrid } from '@chakra-ui/react';

import Column from '~/lib/components/dashboard/Column';
import { useAuth } from '~/lib/components/hooks/useAuth';
import { ColumnType } from '~/utils/enumUtils';

export default function Kanban() {
  useAuth('/');

  return (
    <Box>
      <Heading>Dashboard</Heading>
      <Container maxWidth="container.lg" px={4} py={10}>
        <SimpleGrid columns={{ base: 1, md: 5 }} spacing={{ base: 16, md: 4 }}>
          <Column column={ColumnType.RESUME_COLLECTION} />
          <Column column={ColumnType.RESUME_VERIFIED} />
          <Column column={ColumnType.PHONE_INTERVIEW} />
          <Column column={ColumnType.ON_SITE_INTERVIEW} />
          <Column column={ColumnType.OFFER} />
        </SimpleGrid>
      </Container>
    </Box>
  );
}
