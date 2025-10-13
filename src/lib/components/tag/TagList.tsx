import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState, useCallback } from 'react';

import {
  fetchTags,
  createTag,
  updateTag,
  deleteTag,
} from '~/lib/services/api/tags';
import type { Tag, TagCreateRequest } from '~/lib/types/tag';

export const TagList = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [editTagName, setEditTagName] = useState('');

  const loadTags = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTags = await fetchTags();
      setTags(fetchedTags);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load tags';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Load tags on mount
  useEffect(() => {
    loadTags();
  }, [loadTags]);

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Tag name cannot be empty',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setActionLoading('create');
      const tagData: TagCreateRequest = { name: newTagName.trim() };
      const createdTag = await createTag(tagData);
      setTags([...tags, createdTag]);
      setNewTagName('');
      onClose();
      toast({
        title: 'Tag Created',
        description: `Tag "${createdTag.name}" has been created successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create tag';
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditClick = (tag: Tag) => {
    setEditingTag(tag);
    setEditTagName(tag.name);
    onEditOpen();
  };

  const handleUpdateTag = async () => {
    if (!editingTag) return;

    if (!editTagName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Tag name cannot be empty',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setActionLoading(`edit-${editingTag.id}`);
      const updatedTag = await updateTag(editingTag.id, {
        name: editTagName.trim(),
      });
      setTags(tags.map((t) => (t.id === updatedTag.id ? updatedTag : t)));
      onEditClose();
      toast({
        title: 'Tag Updated',
        description: `Tag has been updated to "${updatedTag.name}".`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update tag';
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteTag = async (tag: Tag) => {
    // eslint-disable-next-line no-alert
    if (
      !window.confirm(
        `Are you sure you want to delete the tag "${tag.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setActionLoading(`delete-${tag.id}`);
      await deleteTag(tag.id);
      setTags(tags.filter((t) => t.id !== tag.id));
      toast({
        title: 'Tag Deleted',
        description: `Tag "${tag.name}" has been deleted successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete tag';
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        minHeight="70vh"
        flexDirection="column"
        gap={4}
      >
        <Spinner size="xl" color="blue.500" thickness="4px" />
        <Text>Loading tags...</Text>
      </Flex>
    );
  }

  // Error state
  if (error) {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        minHeight="70vh"
        flexDirection="column"
        gap={4}
      >
        <Text color="red.500" fontSize="lg">
          {error}
        </Text>
        <Button colorScheme="blue" onClick={loadTags}>
          Retry
        </Button>
      </Flex>
    );
  }

  // Empty state
  if (tags.length === 0) {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        minHeight="70vh"
        flexDirection="column"
        gap={4}
      >
        <Text fontSize="lg" color="gray.500">
          No tags yet, create your first tag
        </Text>
        <Button colorScheme="blue" onClick={onOpen}>
          Create Tag
        </Button>

        {/* Create Tag Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Tag</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isRequired>
                <FormLabel>Tag Name</FormLabel>
                <Input
                  placeholder="Enter tag name"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateTag();
                    }
                  }}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={handleCreateTag}
                isLoading={actionLoading === 'create'}
              >
                Create
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    );
  }

  // Main tag list display
  return (
    <Box p={4} w="full">
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">Tags</Heading>
        <Button colorScheme="blue" onClick={onOpen}>
          Create Tag
        </Button>
      </Flex>

      <VStack spacing={3} align="stretch">
        {tags.map((tag) => (
          <Box
            key={tag.id}
            p={4}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
          >
            <Flex justifyContent="space-between" alignItems="center">
              <Box>
                <Text fontSize="lg" fontWeight="bold">
                  {tag.name}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Created: {new Date(tag.created_at).toLocaleDateString()}
                </Text>
              </Box>
              <Flex gap={2}>
                <IconButton
                  aria-label="Edit tag"
                  icon={<EditIcon />}
                  colorScheme="blue"
                  variant="ghost"
                  onClick={() => handleEditClick(tag)}
                  isLoading={actionLoading === `edit-${tag.id}`}
                />
                <IconButton
                  aria-label="Delete tag"
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => handleDeleteTag(tag)}
                  isLoading={actionLoading === `delete-${tag.id}`}
                />
              </Flex>
            </Flex>
          </Box>
        ))}
      </VStack>

      {/* Create Tag Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Tag</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Tag Name</FormLabel>
              <Input
                placeholder="Enter tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateTag();
                  }
                }}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleCreateTag}
              isLoading={actionLoading === 'create'}
            >
              Create
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Tag Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Tag</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Tag Name</FormLabel>
              <Input
                placeholder="Enter tag name"
                value={editTagName}
                onChange={(e) => setEditTagName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleUpdateTag();
                  }
                }}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleUpdateTag}
              isLoading={
                editingTag ? actionLoading === `edit-${editingTag.id}` : false
              }
            >
              Update
            </Button>
            <Button variant="ghost" onClick={onEditClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
