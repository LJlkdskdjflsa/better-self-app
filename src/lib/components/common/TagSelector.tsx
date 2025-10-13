import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
  Wrap,
  WrapItem,
  Tag as ChakraTag,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react';
import { useState, useMemo } from 'react';

import type { Tag } from '~/lib/types/tag';

interface TagSelectorProps {
  availableTags: Tag[];
  selectedTagIds: string[];
  onChange: (selectedIds: string[]) => void;
  isDisabled?: boolean;
}

export const TagSelector = ({
  availableTags,
  selectedTagIds,
  onChange,
  isDisabled = false,
}: TagSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tags based on search query
  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) {
      return availableTags;
    }
    const query = searchQuery.toLowerCase();
    return availableTags.filter((tag) =>
      tag.name.toLowerCase().includes(query)
    );
  }, [availableTags, searchQuery]);

  // Get selected tags for display
  const selectedTags = useMemo(() => {
    return availableTags.filter((tag) => selectedTagIds.includes(tag.id));
  }, [availableTags, selectedTagIds]);

  const handleToggleTag = (tagId: string) => {
    if (isDisabled) return;

    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTagIds, tagId]);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    if (isDisabled) return;
    onChange(selectedTagIds.filter((id) => id !== tagId));
  };

  return (
    <FormControl>
      <FormLabel>Tags</FormLabel>

      {/* Selected tags display */}
      {selectedTags.length > 0 && (
        <Wrap mb={3} spacing={2}>
          {selectedTags.map((tag) => (
            <WrapItem key={tag.id}>
              <ChakraTag size="md" colorScheme="blue" borderRadius="full">
                <TagLabel>{tag.name}</TagLabel>
                {!isDisabled && (
                  <TagCloseButton onClick={() => handleRemoveTag(tag.id)} />
                )}
              </ChakraTag>
            </WrapItem>
          ))}
        </Wrap>
      )}

      {/* Search input */}
      <InputGroup mb={3}>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          isDisabled={isDisabled}
        />
      </InputGroup>

      {/* Tag list with checkboxes */}
      <Box
        maxH="200px"
        overflowY="auto"
        borderWidth="1px"
        borderRadius="md"
        p={3}
      >
        {filteredTags.length === 0 ? (
          <Text color="gray.500" fontSize="sm" textAlign="center">
            {searchQuery ? 'No tags found' : 'No tags available'}
          </Text>
        ) : (
          <VStack align="stretch" spacing={2}>
            {filteredTags.map((tag) => (
              <Checkbox
                key={tag.id}
                isChecked={selectedTagIds.includes(tag.id)}
                onChange={() => handleToggleTag(tag.id)}
                isDisabled={isDisabled}
              >
                {tag.name}
              </Checkbox>
            ))}
          </VStack>
        )}
      </Box>

      {availableTags.length === 0 && (
        <Text fontSize="sm" color="gray.500" mt={2}>
          No tags available. Create tags in the{' '}
          <Text as="span" color="blue.500" fontWeight="bold">
            Tags page
          </Text>{' '}
          first.
        </Text>
      )}
    </FormControl>
  );
};
