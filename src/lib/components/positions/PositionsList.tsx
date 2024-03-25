import {
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { fetchPositions } from '~/lib/components/positions/apis';
import type { Position } from '~/lib/components/positions/interfaces';
import PositionCard from '~/lib/components/positions/PositionCard';

import CreateUpdatePositionForm from './CreatePositionForm';

interface PositionsListProps {
  isDeleted: boolean;
}

const PositionsList: React.FC<PositionsListProps> = ({ isDeleted }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        // Construct a unique key for caching based on the isDeleted flag
        // const cacheKey = isDeleted ? 'deletedPositions' : 'positions';
        // const data = queryClient.getQueryData<Position[]>(cacheKey);

        // if (!data) {
        const response = await fetchPositions({
          page: currentPage,
          pageSize,
          deleted: isDeleted,
        });
        setPositions(response.data || []);
        // queryClient.setQueryData(cacheKey, response.data || []);
        setTotalPages(response.pagination.page_count);
        // } else {
        //   setPositions(data || []);
        // }
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isDeleted, currentPage, pageSize]);

  if (isLoading) return <Text>{t('loading')}</Text>;
  if (isError) return <Text>{t('error-loading-positions')}</Text>;

  return (
    <Box bg="white" p={10} mt={10} boxShadow="xl" borderRadius="lg" w="60%">
      <Flex alignItems="center" justifyContent="space-between">
        <Heading as="h1" size="xl">
          {t('position-list')}
        </Heading>
        <Spacer />
        {!isDeleted && (
          <Button onClick={onOpen} mb={4} colorScheme="blue">
            {t('common:create')}
          </Button>
        )}
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('common:create')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreateUpdatePositionForm onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Box w="100%" h="85%" m={5} overflowY="auto">
        <Box>
          {positions && positions.length > 0 ? (
            positions.map((position) => (
              <PositionCard position={position} key={position.id} />
            ))
          ) : (
            <Text>{t('position-list-empty')}</Text>
          )}
        </Box>
      </Box>
      <Flex justifyContent="space-between" alignItems="center" mt="4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          isDisabled={currentPage === 1}
        >
          Previous
        </Button>
        <Text>
          Page {currentPage} of {totalPages}
        </Text>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          isDisabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Flex>
    </Box>
  );
};

export default PositionsList;
