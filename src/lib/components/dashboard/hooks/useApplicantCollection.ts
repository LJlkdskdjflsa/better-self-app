import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useQuery } from 'react-query';

import type { ApplicantBoardModel } from '../model';
import { formatData } from '../utils/formData';

function useApplicantCollection() {
  const toast = useToast();

  const fetchTasks = async () => {
    const response = await axios.get(
      'http://127.0.0.1:8001/api/positionapps/',
      {
        headers: { Authorization: 'Bearer AFG9JxtaRz79cjLZnhuz406uypiae6' },
      }
    );
    if (response.data.success) {
      return formatData(response.data.data);
    }
    throw new Error('Failed to fetch tasks');
  };

  const {
    data: tasks,
    error,
    refetch,
  } = useQuery<ApplicantBoardModel, Error>('tasks', fetchTasks, {
    onError: () => {
      toast({
        title: '更新應聘者失敗',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    },
  });

  return { tasks, error, refetch };
}

export default useApplicantCollection;
