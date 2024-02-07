/* eslint-disable sonarjs/no-duplicate-string, react-hooks/exhaustive-deps */

import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import type {
  ApplicantBoardModel,
  ApplicantModelNew,
  ColumnType,
} from '../models/applicanModel';
import { formatData } from '../utils/formData';
import { debug } from '../utils/logging';

function useColumnApplicants(column: ColumnType) {
  // use state to store the applicant data
  const [, setApplicantDict] = useState<ApplicantBoardModel>({});

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

  // use effect to fetch the applicant data from the api
  useEffect(() => {
    setApplicantDict(tasks ?? {});
  }, [refetch]);

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
      debug(`Removing task ${id}..`);
      try {
        await axios.delete(POSITION_URL, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          data: {
            jobapp_id: id,
          },
        });
        refetch();
      } catch (error) {
        toast({
          title: '刪除失敗',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
      }
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
  if (tasks) {
    // safeTasks = applicantDict[column.value as keyof typeof tasks];
    safeTasks = tasks[column.value as keyof typeof tasks];
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
