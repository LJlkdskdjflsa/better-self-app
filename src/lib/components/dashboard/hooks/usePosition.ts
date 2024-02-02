import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Job {
  id: number;
  job: string;
}
const usePositions = () => {
  const [positions, setPositions] = useState<Job[]>([]);
  const toast = useToast();

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/positions/company`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
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

  return positions;
};

export default usePositions;
