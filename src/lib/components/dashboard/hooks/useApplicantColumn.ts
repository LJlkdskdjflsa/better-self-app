/* eslint-disable sonarjs/no-duplicate-string, react-hooks/exhaustive-deps */

import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useCallback } from 'react';

import type { ApplicantModelNew, ColumnType } from '../models/applicanModel';
import { debug } from '../utils/logging';
import useApplicantsStore from '~/lib/store/applicantsStore';

function useColumnApplicants(column: ColumnType) {
  // const { applicants, deleteApplicant, refetch, updateApplicantStatus } = useApplicants();
  const { applicants, deleteApplicant } = useApplicantsStore((state) => ({
    applicants: state.applicants,
    fetchApplicants: state.fetchApplicants,
    deleteApplicant: state.deleteApplicant,
    isLoading: state.isLoading,
  }));

  const toast = useToast();
  const POSITION_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/positionapps/`;

  const addNewTask = async (
    applicant: {
      name: string;
      position: number;
    },
    afterCreate: () => void
  ): Promise<void> => {
    try {
      await axios.post(
        POSITION_URL,
        {
          position_id: applicant.position,
          status_id: column.id,
          first_name: applicant.name,
          last_name: '',
          company: 'Fuhai',
          application_date: '2024-01-13',
          source: 'N/A',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      refetch();
      afterCreate();
    } catch (error) {
      toast({
        title: '創建失敗',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  const deleteTask = useCallback(async (id: ApplicantModelNew['id']) => {
    deleteApplicant(id);
  }, []);

  const updateTask = useCallback(
    (
      id: ApplicantModelNew['id']
      // updatedTask: Omit<Partial<ApplicantModelNew>, 'id'>
    ) => {
      debug(`Updating task ${id} with ${JSON.stringify(updateTask)}`);
      // setTasks((allTasks) => {
      //   const columnTasks = allTasks[column.value as keyof typeof allTasks];
      //   return {
      //     ...allTasks,
      //     [column.value]: columnTasks.map((task) =>
      //       task.id === id ? { ...task, ...updatedTask } : task
      //     ),
      //   };
      // });
    },
    []
  );

  const dropTaskFrom = useCallback(
    async (fromColumn: string, id: ApplicantModelNew['id']) => {
      debug(`Updating task ${id} with ${JSON.stringify(updateTask)}`);
      // updateApplicantStatus(id, column);
    },
    [column, toast]
  );

  const swapTasks = useCallback(
    (i: number, j: number) => {
      debug(`Swapping task ${i} with ${j} in ${column.value} column`);
    },
    [column.value]
  );

  let safeTasks: ApplicantModelNew[] = [];
  if (applicants) {
    // safeTasks = applicantDict[column.value as keyof typeof tasks];
    safeTasks = applicants[column.value as keyof typeof applicants];
  } else {
    safeTasks = [];
  }

  return {
    tasks: safeTasks,
    addNewTask,
    updateTask,
    dropTaskFrom,
    deleteTask,
    swapTasks,
  };
}

export default useColumnApplicants;
