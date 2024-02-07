'use client';

import { DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ScaleFade,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import _ from 'lodash';
import { memo } from 'react';

import NoteTab from './applicantCardTabs/NoteTab';
import PositionTab from './applicantCardTabs/PositionTab';
import { useTaskDragAndDrop } from './hooks/useTaskDragAndDrop';
import type { ApplicantModelNew } from './models/applicanModel';

type ApplicantCardProps = {
  index: number;
  task: ApplicantModelNew;
  // onUpdate: (id: ApplicantModelNew['id'], updatedTask: ApplicantModelNew) => void;
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
  // const positions = usePositions();
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
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
                <Text style={{ whiteSpace: 'nowrap' }}>職位</Text>
              </Tab>
              <Tab>備註</Tab>
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
  // onUpdate: handleUpdate,
  onDropHover: handleDropHover,
  onDelete: handleDelete,
}: ApplicantCardProps) {
  const { ref, isDragging } = useTaskDragAndDrop<HTMLDivElement>(
    { task, index },
    handleDropHover
  );

  const handleDeleteClick = () => {
    handleDelete(task.id);
  };

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
          // bgColor={task.color}
          // bgColor="white"
          bgColor="red"
          opacity={isDragging ? 0.5 : 1}
        >
          <Box bg="white" onClick={onOpen}>
            <Text
              fontWeight="semibold"
              cursor="inherit"
              border="none"
              p={0}
              resize="none"
              // minH={70}
              // maxH={200}
              color="gray.700"
              // onChange={handleTitleChange}
            >
              {task.first_name}
            </Text>
            <Text color="gray.400" fontSize="sm">
              {task.position.job}
            </Text>
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
            bg="green"
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
    // prev.onUpdate === next.onUpdate
  );
});
