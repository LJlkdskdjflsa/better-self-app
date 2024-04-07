// ...

import {
  Box,
  Button,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { FaTrash } from 'react-icons/fa';

import type { usePositions } from '../hooks/usePositions';
import { baseModalStyles } from '~/lib/styles/modal';

import { restorePosition } from './apis';
import CreateUpdatePositionForm from './CreateUpdatePositionForm';
import type { Position } from './interfaces';

export default function PositionCard({
  position,
  refetch,
  onDeleteSuccess,
}: {
  position: Position;
  refetch: ReturnType<typeof usePositions>['refetch'];
  onDeleteSuccess: () => void;
}) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isUpdateOpen,
    onOpen: onOpenUpdate,
    onClose: onCloseUpdate,
  } = useDisclosure();
  const { t } = useTranslation();

  const deletePosition = async () => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/positions/company`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          data: {
            position_id: position.id,
          },
        }
      );

      if (res?.status === 200) {
        onDeleteSuccess();
      }

      toast({
        title: t('common:delete-completed'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Refresh the list of positions
    } catch (error) {
      toast({
        title: t('common:delete-failed'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const copyLinkToClipboard = async () => {
    try {
      const link = `${process.env.NEXT_PUBLIC_APP_URL}/jobs/${position.uuid}`; // Replace with the actual link you want to copy
      await navigator.clipboard.writeText(link);
      toast({
        title: t('common:link-copied'),
        status: 'success',
        duration: 3000,
        position: 'top',
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: t('common:link-copy-failed'),
        status: 'error',
        duration: 3000,
        position: 'top',
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      {/* ...existing position card content... */}
      <Box
        key={position.id}
        p={4}
        shadow="md"
        borderWidth="1px"
        borderRadius="md"
        mb={4}
      >
        <Flex alignItems="center">
          <Box>
            <Text fontSize="xl" fontWeight="bold">
              {position.job}
            </Text>
            <Text>
              {t('department')}：{position.department}
            </Text>
            <Text>
              {t('job-type')}：{position.job_type}
            </Text>
            <Text>
              {t('created-date')}：
              {new Date(position.created_date).toLocaleDateString()}
            </Text>
          </Box>
          <Spacer />
          <Flex>
            <Stack direction="row" spacing={3}>
              <Button onClick={onOpen} colorScheme="blue">
                {t('common:detail')}
              </Button>

              {!position.is_deleted ? (
                <>
                  <Button onClick={onOpenUpdate} colorScheme="green">
                    {t('common:update')}
                  </Button>
                  <Button onClick={copyLinkToClipboard} colorScheme="yellow">
                    {t('common:link')}
                  </Button>
                  <Button onClick={deletePosition} colorScheme="red">
                    <Icon as={FaTrash} />
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => restorePosition(position.id, toast)}
                  colorScheme="yellow"
                >
                  {t('job-restore')}
                </Button>
              )}
            </Stack>
            {/* detail modal */}
            <Modal isOpen={isOpen} onClose={onClose} {...baseModalStyles.modal}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>{t('common:detail')}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Stack spacing={3}>
                    <Text>
                      {t('company')}：{position.company.company}
                    </Text>
                    <Text>
                      {t('job-position')}：{position.job}
                    </Text>
                    <Text>
                      {t('department')}：{position.department}
                    </Text>
                    <Text>
                      {t('job-type')}：{position.job_type}
                    </Text>
                    <Text>{t('position:position-introduction')}</Text>
                    <Textarea value={position.responsibilities} readOnly />
                    <Text>{t('position-requirement')}</Text>
                    <Textarea value={position.requirements} readOnly />
                  </Stack>
                </ModalBody>
              </ModalContent>
            </Modal>
            {/* update modal */}
            <Modal
              isOpen={isUpdateOpen}
              onClose={onCloseUpdate}
              {...baseModalStyles.modal}
            >
              <ModalOverlay />
              <ModalContent {...baseModalStyles.modalContent}>
                <ModalHeader>{t('update-position')}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <CreateUpdatePositionForm
                    onClose={onCloseUpdate}
                    onCreateOrUpdateSuccess={() => {
                      refetch();
                      onCloseUpdate();
                    }}
                    position={{
                      ...position,
                      job_title: position.job,
                      state_id: position.state.id,
                      country_id: position.country.id,
                      company_id: position.company.id,
                    }}
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
