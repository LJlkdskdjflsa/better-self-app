import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useCallback } from 'react';
import { useQuery } from 'react-query';

import type {
  ApplicantBoardModel,
  ApplicantModelNew,
  ColumnType,
} from '../model';
import { formatData } from '../utils/formData';
import { debug } from '../utils/logging';

function useColumnApplicants(column: ColumnType) {
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
    // error,
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

  const addEmptyTask = useCallback(() => {
    debug(`Adding new empty task to ${column.value} column`);
    // setTasks((allTasks) => {
    //   // const columnTasks = allTasks[column];
    //   const columnTasks = allTasks[column.value as keyof typeof allTasks];

    //   if (columnTasks.length > MAX_TASK_PER_COLUMN) {
    //     debug('Too many task!');
    //     return allTasks;
    //   }

    //   const newColumnTask: ApplicantModelNew = {
    //     id: uuidv4(),
    //     title: `New ${column.value} task`,
    //     // color: pickChakraRandomColor('.300'),
    //     color: 'gray.300',
    //     column: column.value,
    //   };

    //   return {
    //     ...allTasks,
    //     [column.value]: [newColumnTask, ...columnTasks],
    //   };
    // });
  }, [column]);

  const deleteTask = useCallback((id: ApplicantModelNew['id']) => {
    debug(`Removing task ${id}..`);
    // setTasks((allTasks) => {
    //   const columnTasks = allTasks[column.value as keyof typeof allTasks];
    //   return {
    //     ...allTasks,
    //     [column.value]: columnTasks.filter((task) => task.id !== id),
    //   };
    // });
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
      try {
        await axios.put(
          'http://127.0.0.1:8001/api/positionapps/',
          {
            jobapp_id: id,
            status_id: column.id,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer AFG9JxtaRz79cjLZnhuz406uypiae6',
            },
          }
        );
        refetch();
      } catch (error) {
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
    safeTasks = tasks[column.value as keyof typeof tasks];
  } else {
    safeTasks = [];
  }

  return {
    tasks: safeTasks,
    addEmptyTask,
    updateTask,
    dropTaskFrom,
    deleteTask,
    swapTasks,
  };
}

export default useColumnApplicants;
