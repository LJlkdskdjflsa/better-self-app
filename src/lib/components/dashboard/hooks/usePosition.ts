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

  return positions;
};

export default usePositions;
