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
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import {
  fetchDeletedPositions,
  fetchPositions,
} from '~/lib/components/positions/apis';
import type { Position } from '~/lib/components/positions/interfaces';
import PositionCard from '~/lib/components/positions/PositionCard';

import CreateUpdatePositionForm from './CreatePositionForm';

interface PositionsListProps {
  isDeleted: boolean;
}

const PositionsList: React.FC<PositionsListProps> = ({ isDeleted }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fetchFunction = isDeleted ? fetchDeletedPositions : fetchPositions;
  const { t } = useTranslation();

  const {
    data: positions,
    isLoading,
    isError,
  } = useQuery<Position[], Error>(['positions', { isDeleted }], () =>
    fetchFunction()
  );

  if (isLoading) return <Text>{t('loading')}</Text>;
  if (isError) return <Text>{t('error-loading-positions')}</Text>;

  return (
    <Box bg="white" p={10} mt={10} boxShadow="xl" borderRadius="lg" w="60%">
      {/* Button to open the modal */}

      {/* Header */}
      <Flex alignItems="center" justifyContent="space-between" mb={10}>
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
      {/* Modal for CreateUpdatePositionForm */}
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

      {/* Positions List */}
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
  );
};

export default PositionsList;
