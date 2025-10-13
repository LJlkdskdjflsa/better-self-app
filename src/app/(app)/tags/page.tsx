'use client';

import { Box } from '@chakra-ui/react';

import { TagList } from '~/lib/components/tag/TagList';

const TagsPage = () => {
  return (
    <Box
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      gap={4}
      mb={8}
      w="full"
    >
      <TagList />
    </Box>
  );
};

export default TagsPage;
