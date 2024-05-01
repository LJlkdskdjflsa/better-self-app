'use client';

import { DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ScaleFade,
  Spacer,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import _ from 'lodash';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useHRModal } from '../common/ModalProvider';
import { baseModalStyles } from '~/lib/styles/modal';

import NoteTab from './applicantCardTabs/NoteTab';
import PositionTab from './applicantCardTabs/PositionTab';
import { useTaskDragAndDrop } from './hooks/useTaskDragAndDrop';
import type { ApplicantModelNew } from './models/applicantModel';

type ApplicantCardProps = {
  index: number;
  task: ApplicantModelNew;
  onDelete: (id: ApplicantModelNew['id']) => void;
  onDropHover: (i: number, j: number) => void;
};

function ApplicantModal({
  task,
  isOpen,
  onClose,
}: {
  task: ApplicantModelNew;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      // size="6xl"
      {...baseModalStyles.modal}
    >
      <ModalOverlay />
      <ModalContent w="100%" h="100%">
        <ModalHeader>
          <Text
            fontWeight="semibold"
            cursor="inherit"
            border="none"
            p={0}
            resize="none"
            color="gray.700"
          >
            {task.first_name}
          </Text>
          <Text color="gray.400" fontSize="sm">
            {task.position.job}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs orientation="vertical">
            <TabList>
              <Tab>
                <Text style={{ whiteSpace: 'nowrap' }}>
                  {t('common:position')}
                </Text>
              </Tab>
              <Tab>{t('common:note')}</Tab>
            </TabList>

            <TabPanels>
              <PositionTab task={task} />
              <NoteTab task={task} />
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          {/* <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button> */}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function ApplicantCard({
  index,
  task,
  onDropHover: handleDropHover,
  onDelete: handleDelete,
}: ApplicantCardProps) {
  const { ref, isDragging } = useTaskDragAndDrop<HTMLDivElement>(
    { task, index },
    handleDropHover
  );
  const { t } = useTranslation('common');

  const { showModal, hideModal } = useHRModal();
  const handleDeleteClick = () => {
    const actionToPerform = () => {
      handleDelete(task.id);
      hideModal();
    };

    showModal(
      null,
      () => {
        actionToPerform();
      },
      {
        headerContent: (
          <ModalHeader>{t('confirm-to-change-state')}</ModalHeader>
        ),
        footerProps: {
          confirmButtonProps: { colorScheme: 'blue', content: t('confirm') },
          cancelButtonProps: { content: t('cancel') },
        },
      }
    );
  };

  function getBadgeColorScheme(score: ApplicantModelNew['ai_resume_score']) {
    if (score === 'A') return 'red.500';
    if (score === 'B') return 'green.500';
    if (score === 'C') return 'gray.500';
    return ''; // Return an empty string for scores not A, B, or C
  }

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <ScaleFade in unmountOnExit>
        <Box
          ref={ref}
          as="div"
          role="group"
          position="relative"
          rounded="lg"
          pl={3}
          pr={7}
          pt={3}
          pb={1}
          boxShadow="xl"
          cursor="grab"
          fontWeight="bold"
          userSelect="none"
          bgColor="white"
          opacity={isDragging ? 0.5 : 1}
        >
          <Box bg="white" onClick={onOpen}>
            <Flex pr={4}>
              <Box>
                <Text
                  fontWeight="semibold"
                  cursor="inherit"
                  border="none"
                  p={0}
                  resize="none"
                  color="gray.700"
                >
                  {task.first_name}
                </Text>
                <Text wordBreak="break-word" color="gray.400" fontSize="sm">
                  {task.position.job}
                </Text>
              </Box>
              <Spacer />
              {['A', 'B', 'C'].includes(task.ai_resume_score ?? '') && (
                <Text
                  ml="4"
                  fontSize="3xl"
                  fontWeight="bold"
                  color={getBadgeColorScheme(task.ai_resume_score)}
                >
                  {task.ai_resume_score}
                </Text>
              )}
            </Flex>

            <Flex alignItems="end">
              <Spacer />
              <Text color="gray.400" fontSize="small">
                {new Date(task.apply_date).toLocaleDateString()}
              </Text>
            </Flex>
          </Box>
          <IconButton
            position="absolute"
            top={0}
            right={0}
            zIndex={100}
            aria-label="delete-task"
            size="md"
            colorScheme="solid"
            color="gray.700"
            icon={<DeleteIcon />}
            opacity={0}
            _groupHover={{
              opacity: 1,
            }}
            onClick={handleDeleteClick}
          />
        </Box>
      </ScaleFade>
      <ApplicantModal task={task} isOpen={isOpen} onClose={onClose} />
    </>
  );
}

export default memo(ApplicantCard, (prev, next) => {
  return (
    _.isEqual(prev.task, next.task) &&
    _.isEqual(prev.index, next.index) &&
    prev.onDelete === next.onDelete &&
    prev.onDropHover === next.onDropHover
  );
});
