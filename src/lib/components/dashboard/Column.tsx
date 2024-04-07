'use client';

import { AddIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Center,
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
  Spacer,
  Stack,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { baseModalStyles } from '~/lib/styles/modal';

import ApplicantCard from './ApplicantCard';
import useColumnApplicants from './hooks/useApplicantColumn';
import useColumnDrop from './hooks/useColumnDrop';
import usePositions from './hooks/usePosition';
import type { ApplicantModelNew, ColumnType } from './models/applicantModel';

function Column({ column }: { column: ColumnType }) {
  const {
    tasks,
    addNewApplicant,
    deleteTask,
    dropTaskFrom,
    swapTasks,
    // updateTask,
  } = useColumnApplicants(column);
  const { t } = useTranslation();

  const { dropRef, isOver } = useColumnDrop(column.value, dropTaskFrom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [applicant, setApplicant] = useState({
    name: '',
    position: 0, // invalid value
  });

  // const [positions, setPositions] = useState<Job[]>([]);
  const positions = usePositions();

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

  useEffect(() => {
    if (positions.length > 0) {
      setApplicant((prev) => ({
        ...prev,
        // Set the position to the first position's ID
        position: positions[0].id,
      }));
    }
  }, [positions]);

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

      <Box
        h="90%"
        boxShadow="md"
        borderRadius="lg"
        bgColor={useColorModeValue('gray.300', 'gray.900')}
        justifyContent="center"
      >
        <Flex direction="column" maxH="80vh" h="100%">
          <Flex
            direction="column"
            justifyContent="space-between"
            ref={dropRef}
            // h={{ base: 300, md: 600 }}
            maxH="80vh"
            h="100%"
            p={4}
            mt={2}
            rounded="lg"
            overflow="auto"
            opacity={isOver ? 0.85 : 1}
          >
            <Stack spacing={4}>{ColumnTasks}</Stack>
            <Modal isOpen={isOpen} onClose={onClose} {...baseModalStyles.modal}>
              <ModalOverlay />
              <ModalContent {...baseModalStyles.modalContent}>
                <ModalHeader>{t('common:new-applicant')}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl>
                    <FormLabel>{t('common:name')}</FormLabel>
                    <Input
                      value={applicant.name}
                      onChange={(e) =>
                        setApplicant((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>{t('common:position')}</FormLabel>
                    <Select
                      value={applicant.position || ''}
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
                <ModalFooter justifyContent="center">
                  <Button colorScheme="red" mr={3} onClick={onClose}>
                    {t('common:cancel')}
                  </Button>
                  <Button
                    colorScheme="blue"
                    onClick={() =>
                      addNewApplicant(
                        {
                          position: applicant.position,
                          status: column,
                          name: applicant.name,
                        },
                        onClose
                      )
                    }
                  >
                    {t('common:confirm')}
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Flex>
          <Spacer />
          <Center>
            <IconButton
              size="xs"
              w="80%"
              color={useColorModeValue('gray.500', 'gray.400')}
              bgColor={useColorModeValue('gray.100', 'gray.700')}
              _hover={{ bgColor: useColorModeValue('gray.200', 'gray.600') }}
              py={2}
              mb={3}
              mt={3}
              variant="solid"
              onClick={onOpen}
              colorScheme="black"
              aria-label="add-task"
              icon={<AddIcon />}
            />
          </Center>
        </Flex>
      </Box>
    </Box>
  );
}

export default Column;
