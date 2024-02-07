/* eslint-disable sonarjs/no-duplicate-string, react-hooks/exhaustive-deps */

import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useCallback } from 'react';

import type { ApplicantModelNew, ColumnType } from '../models/applicanModel';
import { debug } from '../utils/logging';

import { useApplicants } from './useApplicants';

function useColumnApplicants(column: ColumnType) {
  const { applicants, deleteApplicant, refetch } = useApplicants();

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

  const deleteTask = useCallback(
    async (id: ApplicantModelNew['id']) => {
      deleteApplicant(id, column.value as keyof typeof applicants);
    },
    [refetch, toast]
  );

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
      // Optimistically update the UI here

      // get the object of the column

      // For example, you might move the task to the new column in your local state

      try {
        await axios.put(
          POSITION_URL,
          {
            jobapp_id: id,
            status_id: column.id,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        );
        // If the request is successful, you don't need to do anything
      } catch (error) {
        // If the request fails, rollback the optimistic update
        // For example, you might move the task back to the original column in your local state

        toast({
          title: 'Error',
          description: 'Failed to update status',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }
    },
    [column, refetch, toast]
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
