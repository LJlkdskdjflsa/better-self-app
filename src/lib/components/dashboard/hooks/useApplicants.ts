import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import type {
  ApplicantBoardModel,
  ApplicantModelNew,
} from '../models/applicanModel';
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

  const deleteApplicant = async (
    applicantId: ApplicantModelNew['id'],
    stage: keyof ApplicantBoardModel
  ) => {
    // 樂觀地更新本地狀態
    const previousApplicants = { ...applicants };
    if (applicants && stage in applicants) {
      setApplicants({
        ...applicants,
        [stage]: applicants[stage].filter(
          (applicant) => applicant.id !== applicantId
        ),
      });
    }

    try {
      // 嘗試從服務器刪除applicant
      await axios.delete(POSITION_URL, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        data: {
          jobapp_id: applicantId,
        },
      });
      toast({
        title: '刪除成功',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      // 重新獲取最新的applicant列表
      await refetch();
    } catch (error) {
      // 如果刪除失敗，回滾本地狀態
      setApplicants(previousApplicants);
      toast({
        title: '刪除失敗',
        description: error.response?.data?.message || '無法刪除applicant。',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  useEffect(() => {
    setApplicants(tasks ?? {});
  }, [tasks, toast]);

  return { applicants, setApplicants, refetch, deleteApplicant };
}
