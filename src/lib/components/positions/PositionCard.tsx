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
import { FaTrash } from 'react-icons/fa';

import { restorePosition } from './apis';
import CreateUpdatePositionForm from './CreatePositionForm';
import type { Position } from './interfaces';

export default function PositionCard({ position }: { position: Position }) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isUpdateOpen,
    onOpen: onOpenUpdate,
    onClose: onCloseUpdate,
  } = useDisclosure();

  const deletePosition = async () => {
    try {
      await axios.delete(
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

      toast({
        title: '職位已成功刪除',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Refresh the list of positions
    } catch (error) {
      toast({
        title: '刪除職位失敗',
        status: 'error',
        duration: 3000,
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
            <Text>部門：{position.department}</Text>
            <Text>形式：{position.job_type}</Text>
            <Text>
              創建日期：
              {new Date(position.created_date).toLocaleDateString()}
            </Text>
          </Box>
          <Spacer />
          <Flex>
            <Stack direction="row" spacing={3}>
              <Button onClick={onOpen} colorScheme="blue">
                了解詳情
              </Button>
              <Button onClick={onOpenUpdate} colorScheme="green">
                更新職位
              </Button>
              {!position.is_deleted ? (
                <Button onClick={deletePosition} colorScheme="red">
                  <Icon as={FaTrash} />
                </Button>
              ) : (
                <Button
                  onClick={() => restorePosition(position.id, toast)}
                  colorScheme="yellow"
                >
                  恢復職位
                </Button>
              )}
            </Stack>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>職位詳情</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Stack spacing={3}>
                    <Text>公司：{position.company.company}</Text>
                    <Text>職位：{position.job}</Text>
                    <Text>部門：{position.department}</Text>
                    <Text>工作類型：{position.job_type}</Text>
                    <Text>職位介紹</Text>
                    <Textarea value={position.responsibilities} readOnly />
                    <Text>職位要求</Text>
                    <Textarea value={position.requirements} readOnly />
                  </Stack>
                </ModalBody>
              </ModalContent>
            </Modal>
            <Modal isOpen={isUpdateOpen} onClose={onCloseUpdate}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>更新職位</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <CreateUpdatePositionForm
                    onClose={onCloseUpdate}
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
