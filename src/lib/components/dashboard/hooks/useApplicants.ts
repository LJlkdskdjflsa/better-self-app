import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import type { ApplicantBoardModel } from '../models/applicanModel';
import { formatData } from '../utils/formData';

export function useApplicants() {
  const [applicants, setApplicants] = useState<ApplicantBoardModel | null>(
    null
  );
  const toast = useToast();
  const POSITION_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/positionapps/`;

  const fetchApplicantDictFromApi = async () => {
    const response = await axios.get(POSITION_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    if (response.data.success) {
      return formatData(response.data.data);
    }
    throw new Error('Failed to fetch tasks');
  };

  const {
    data: tasks,
    // error,
    refetch,
  } = useQuery<ApplicantBoardModel, Error>('tasks', fetchApplicantDictFromApi, {
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

  useEffect(() => {
    setApplicants(tasks ?? {});
  }, [tasks, toast]);

  return { applicants, setApplicants, refetch };
}
