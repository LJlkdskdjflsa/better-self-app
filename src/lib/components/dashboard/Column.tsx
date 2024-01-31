// @ts-ignore

'use client';

import { AddIcon } from '@chakra-ui/icons';
import {
  Badge,
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
  Select,
  Stack,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

import ApplicantCard from './ApplicantCard';
import useColumnApplicants from './hooks/useColumnApplicants';
import useColumnDrop from './hooks/useColumnDrop';
import type { ApplicantModelNew, ColumnType } from './model';

interface Job {
  id: number;
  job: string;
}

function Column({ column }: { column: ColumnType }) {
  const {
    tasks,
    addNewTask,
    deleteTask,
    dropTaskFrom,
    swapTasks,
    // updateTask,
  } = useColumnApplicants(column);

  const { dropRef, isOver } = useColumnDrop(column.value, dropTaskFrom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [applicant, setApplicant] = useState({ name: '', position: 1 });
  const [positions, setPositions] = useState<Job[]>([]);
  const toast = useToast();

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axios.get(
          'http://127.0.0.1:8001/api/positions/company',
          {
            headers: {
              Authorization: 'Bearer AFG9JxtaRz79cjLZnhuz406uypiae6',
            },
          }
        );
        setPositions(response.data.data);
      } catch (error) {
        toast({
          title: '錯誤',
          description: '無法獲取職位數據',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
      }
    };

    fetchPositions();
  }, [toast]);

  const safeTasks = tasks || [];

  const ColumnTasks = safeTasks.map(
    (task: ApplicantModelNew, index: number) => (
      <ApplicantCard
        key={task.id}
        task={task}
        index={index}
        onDropHover={swapTasks}
        // onUpdate={updateTask}
        onDelete={deleteTask}
      />
    )
  );

  return (
    <Box>
      <Heading fontSize="md" mb={4} letterSpacing="wide">
        <Badge
          px={2}
          py={1}
          rounded="lg"
          // colorScheme={ColumnColorScheme[column]}
        >
          {column.value}
        </Badge>
      </Heading>

      <Flex
        direction="column"
        justifyContent="space-between"
        ref={dropRef}
        h={{ base: 300, md: 600 }}
        p={4}
        mt={2}
        bgColor={useColorModeValue('gray.300', 'gray.900')}
        rounded="lg"
        boxShadow="md"
        overflow="auto"
        opacity={isOver ? 0.85 : 1}
      >
        <Stack spacing={4}>{ColumnTasks}</Stack>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>新增應聘者</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>姓名</FormLabel>
                <Input
                  value={applicant.name}
                  onChange={(e) =>
                    setApplicant((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>職位</FormLabel>
                <Select
                  placeholder="選擇職位"
                  value={applicant.position}
                  onChange={(e) =>
                    setApplicant((prev) => ({
                      ...prev,
                      position: Number(e.target.value),
                    }))
                  }
                >
                  {positions.map((position) => (
                    <option key={position.id} value={position.id}>
                      {position.job}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                取消
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => addNewTask(applicant, onClose)}
              >
                確認
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <IconButton
          size="xs"
          w="full"
          color={useColorModeValue('gray.500', 'gray.400')}
          bgColor={useColorModeValue('gray.100', 'gray.700')}
          _hover={{ bgColor: useColorModeValue('gray.200', 'gray.600') }}
          py={2}
          variant="solid"
          onClick={onOpen}
          colorScheme="black"
          aria-label="add-task"
          icon={<AddIcon />}
        />
      </Flex>
    </Box>
  );
}

export default Column;
