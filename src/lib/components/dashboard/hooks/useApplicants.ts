import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import type {
  ApplicantBoardModel,
  ApplicantModelNew,
  ColumnType,
} from '../models/applicanModel';
import { formatData, unformatData } from '../utils/formData';

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

  const updateApplicantStatus = async (
    applicantId: ApplicantModelNew['id'],
    newStage: ColumnType
  ) => {
    // 保存原始狀態以便可能的回滾
    const previousApplicants = JSON.parse(JSON.stringify(tasks));

    // 保存原始狀態以便可能的回滾
    const originalStage = Object.keys(tasks || {}).find((key) =>
      (applicants?.[key] as ApplicantModelNew[]).some(
        (applicant) => applicant.id === applicantId
      )
    ) as keyof ApplicantBoardModel;
    if (!originalStage || !applicants) return;

    // 樂觀更新本地狀態
    let updatedApplicantList: ApplicantModelNew[] = unformatData(tasks);

    // 找到要移動的applicant，從 updatedApplicantList
    const applicantToMove: ApplicantModelNew | undefined =
      updatedApplicantList.find((applicant) => applicant.id === applicantId);

    if (!applicantToMove) return;

    // 從 updatedApplicantList 中移除原本的 applicant
    updatedApplicantList = updatedApplicantList.filter(
      (applicant) => applicant.id !== applicantId
    );

    // 添加到新階段
    applicantToMove.application_status.id = newStage.id;
    applicantToMove.application_status.value = newStage.value;
    updatedApplicantList.push(applicantToMove);

    setApplicants(formatData(updatedApplicantList));

    try {
      // 向服務器發送更改狀態的請求
      await axios.put(
        `${POSITION_URL}`,
        {
          jobapp_id: applicantId,
          status_id: newStage.id, // 假設服務器需要的欄位是status_id，並且這裡是新階段的ID
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      toast({
        title: '狀態更新成功',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      refetch(); // 可選的，根據你的需求決定是否需要重新獲取數據
    } catch (error) {
      // 如果更新失敗，回滾到原始狀態
      setApplicants(previousApplicants);
      toast({
        title: '狀態更新失敗',
        description: error.response?.data?.message || '無法更新applicant狀態。',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  return {
    applicants,
    setApplicants,
    refetch,
    deleteApplicant,
    updateApplicantStatus,
  };
}
