// ...

import {
  Box,
  Button,
  Flex,
  Icon,
  Spacer,
  Text,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';

interface Position {
  id: number;
  job: string;
  job_type: string;
  department: string;
  created_date: string;
}

export default function PositionCard({ position }: { position: Position }) {
  const toast = useToast();

  const deletePosition = async () => {
    try {
      await axios.delete('http://127.0.0.1:8001/api/positions/company', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer AFG9JxtaRz79cjLZnhuz406uypiae6',
        },
        data: {
          position_id: position.id,
        },
      });

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
          <Button onClick={deletePosition} colorScheme="red">
            <Icon as={FaTrash} />
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
