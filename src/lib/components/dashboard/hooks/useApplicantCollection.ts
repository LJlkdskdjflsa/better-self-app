// @ts-ignore
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

import type { ApplicantBoardModel } from '../model';
import { formatData } from '../utils/formData';

type SetTaskType = React.Dispatch<React.SetStateAction<ApplicantBoardModel>>;

function useApplicantCollection(): [
  ApplicantBoardModel,
  SetTaskType,
  () => Promise<void>,
] {
  const [tasks, setTasks] = useState<ApplicantBoardModel>({});
  const toast = useToast();

  const fetchTasks = async () => {
    // console.log('fetching tasks');
    try {
      const response = await axios.get(
        'http://127.0.0.1:8001/api/positionapps/',
        {
          headers: { Authorization: 'Bearer AFG9JxtaRz79cjLZnhuz406uypiae6' },
        }
      );
      if (response.data.success) {
        const formattedTasks = formatData(response.data.data);
        setTasks(formattedTasks);
        // console.log('Successfully fetched tasks');
      } else {
        // console.error('Failed to fetch tasks: ', response.data.error_message);
      }
    } catch (error) {
      toast({
        title: '更新應聘者失敗',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  useEffect(() => {
    fetchTasks();
  });

  return [tasks, setTasks, fetchTasks];
}

export default useApplicantCollection;
