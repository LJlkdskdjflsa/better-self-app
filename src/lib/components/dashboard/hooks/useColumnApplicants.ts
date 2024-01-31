import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type { ApplicantModelNew, ColumnType } from '../model';
import { swap } from '../utils/helpers';
import { debug } from '../utils/logging';

import useApplicantCollection from './useApplicantCollection';

const MAX_TASK_PER_COLUMN = 100;

function useColumnApplicants(column: ColumnType) {
  const toast = useToast();

  const [tasks, setTasks, fetchTasks] = useApplicantCollection();
  // console.log(tasks);

  const addEmptyTask = useCallback(() => {
    debug(`Adding new empty task to ${column.value} column`);
    setTasks((allTasks) => {
      // const columnTasks = allTasks[column];
      const columnTasks = allTasks[column.value as keyof typeof allTasks];

      if (columnTasks.length > MAX_TASK_PER_COLUMN) {
        debug('Too many task!');
        return allTasks;
      }

      const newColumnTask: ApplicantModelNew = {
        id: uuidv4(),
        title: `New ${column.value} task`,
        // color: pickChakraRandomColor('.300'),
        color: 'gray.300',
        column: column.value,
      };

      return {
        ...allTasks,
        [column.value]: [newColumnTask, ...columnTasks],
      };
    });
  }, [column, setTasks]);

  const deleteTask = useCallback(
    (id: ApplicantModelNew['id']) => {
      debug(`Removing task ${id}..`);
      setTasks((allTasks) => {
        const columnTasks = allTasks[column.value as keyof typeof allTasks];
        return {
          ...allTasks,
          [column.value]: columnTasks.filter((task) => task.id !== id),
        };
      });
    },
    [column, setTasks]
  );

  const updateTask = useCallback(
    (
      id: ApplicantModelNew['id'],
      updatedTask: Omit<Partial<ApplicantModelNew>, 'id'>
    ) => {
      debug(`Updating task ${id} with ${JSON.stringify(updateTask)}`);
      setTasks((allTasks) => {
        const columnTasks = allTasks[column.value as keyof typeof allTasks];
        return {
          ...allTasks,
          [column.value]: columnTasks.map((task) =>
            task.id === id ? { ...task, ...updatedTask } : task
          ),
        };
      });
    },
    [column, setTasks]
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
        fetchTasks();
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
    [column, fetchTasks, toast]
  );

  const swapTasks = useCallback(
    (i: number, j: number) => {
      debug(`Swapping task ${i} with ${j} in ${column.value} column`);
      setTasks((allTasks) => {
        const columnTasks = allTasks[column.value as keyof typeof allTasks];

        return {
          ...allTasks,
          [column.value]: swap(columnTasks, i, j),
        };
      });
    },
    [column.value, setTasks]
  );

  return {
    tasks: tasks[column.value as keyof typeof tasks],
    addEmptyTask,
    updateTask,
    dropTaskFrom,
    deleteTask,
    swapTasks,
  };
}

export default useColumnApplicants;
