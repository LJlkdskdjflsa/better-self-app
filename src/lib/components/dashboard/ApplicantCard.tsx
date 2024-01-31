'use client';

import { DeleteIcon } from '@chakra-ui/icons';
import { Box, IconButton, ScaleFade, Text } from '@chakra-ui/react';
import _ from 'lodash';
import { memo } from 'react';

import { useTaskDragAndDrop } from './hooks/useTaskDragAndDrop';
import type { ApplicantModelNew } from './model';

type ApplicantCardProps = {
  index: number;
  task: ApplicantModelNew;
  // onUpdate: (id: ApplicantModelNew['id'], updatedTask: ApplicantModelNew) => void;
  onDelete: (id: ApplicantModelNew['id']) => void;
  onDropHover: (i: number, j: number) => void;
};

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

  return (
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
        bgColor="white"
        opacity={isDragging ? 0.5 : 1}
      >
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
    </ScaleFade>
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
