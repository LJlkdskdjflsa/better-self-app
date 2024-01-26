'use client';

import { AddIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import axios from 'axios';
import type { NextPage } from 'next';
import { useQuery } from 'react-query';

import { useAuth } from '~/lib/components/hooks/useAuth';
import HookForm from '~/lib/components/positions/AddPositionForm';

interface Position {
  id: number;
  department: string;
  job_type: string;
  created_date: string;
  job: string;
}

const fetchPositions = async () => {
  // const { token } = useAuth();
  const { data } = await axios.get(
    'http://127.0.0.1:8001/api/positions/company',
    {
      headers: {
        Authorization: 'Bearer AFG9JxtaRz79cjLZnhuz406uypiae6',
      },
    }
  );
  return data.data;
};

const PositionsPage: NextPage = () => {
  useAuth('/');
  const { data: positions, isLoading } = useQuery<Position[]>(
    'positions',
    fetchPositions
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Flex justifyContent="center" height="60%">
      <Box bg="white" p={10} mt={10} boxShadow="xl" borderRadius="lg" w="60%">
        {/* Header */}
        <Flex alignItems="center" justifyContent="space-between" mb={10}>
          <Heading as="h1" size="xl">
            職位列表
          </Heading>
          <Button
            colorScheme="teal"
            size="md"
            onClick={onOpen}
            leftIcon={<AddIcon />}
          >
            新增職位
          </Button>
        </Flex>

        {/* Search and Filters */}
        {/* <Flex justifyContent="space-between" mb={6}>
          <InputGroup w="300px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input placeholder="search" />
          </InputGroup>
          <Flex>
            <Select placeholder="Department" w="200px" mr={4}>
            </Select>
            <Select placeholder="Type" w="200px">
            </Select>
          </Flex>
        </Flex> */}

        {/* Positions List */}
        <Box>
          {/* @ts-expect-error: positions might be undefined */}
          {positions?.length > 0 ? (
            positions?.map((position) => (
              <Box
                key={position.id}
                p={4}
                shadow="md"
                borderWidth="1px"
                borderRadius="md"
                mb={4}
              >
                <Text fontSize="xl" fontWeight="bold">
                  {position.job}
                </Text>
                <Text>部門：{position.department}</Text>
                <Text>形式：{position.job_type}</Text>
                <Text>
                  創建日期：
                  {new Date(position.created_date).toLocaleDateString()}
                </Text>
              </Box>
            ))
          ) : (
            <Text>No positions found based on your criteria!</Text>
          )}
        </Box>

        {/* Pagination */}
        <Flex justifyContent="center" alignItems="center" mt={6}>
          {/* Implement actual pagination logic here */}
          <Button variant="outline" size="sm" mr={2}>
            <ChevronLeftIcon />
          </Button>
          <Text>1</Text>
          <Button variant="outline" size="sm" ml={2}>
            <ChevronRightIcon />
          </Button>
        </Flex>

        {/* Modal - Implement this based on your modal handling logic */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>新增職缺</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <HookForm />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {/* Modal would typically be another component */}
      </Box>
    </Flex>
  );
};

export default PositionsPage;
