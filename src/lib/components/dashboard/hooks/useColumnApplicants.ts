// @ts-nocheck
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { swap } from '../utils/helpers';
import { debug } from '../utils/logging';

import useApplicantCollection from './useApplicantCollection';

const MAX_TASK_PER_COLUMN = 100;

function useColumnApplicants(column: string) {
  const [tasks, setTasks] = useApplicantCollection();

  const addEmptyTask = useCallback(() => {
    debug(`Adding new empty task to ${column} column`);
    setTasks((allTasks) => {
      // const columnTasks = allTasks[column];
      const columnTasks = allTasks[column as keyof typeof allTasks];

      if (columnTasks.length > MAX_TASK_PER_COLUMN) {
        debug('Too many task!');
        return allTasks;
      }

      const newColumnTask: ApplicantModelNew = {
        id: uuidv4(),
        title: `New ${column} task`,
        // color: pickChakraRandomColor('.300'),
        color: 'gray.300',
        column,
      };

      return {
        ...allTasks,
        [column]: [newColumnTask, ...columnTasks],
      };
    });
  }, [column, setTasks]);

  const deleteTask = useCallback(
    (id: ApplicantModelNew['id']) => {
      debug(`Removing task ${id}..`);
      setTasks((allTasks) => {
        const columnTasks = allTasks[column as keyof typeof allTasks];
        return {
          ...allTasks,
          [column]: columnTasks.filter((task) => task.id !== id),
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
        const columnTasks = allTasks[column as keyof typeof allTasks];
        return {
          ...allTasks,
          [column]: columnTasks.map((task) =>
            task.id === id ? { ...task, ...updatedTask } : task
          ),
        };
      });
    },
    [column, setTasks]
  );

  const dropTaskFrom = useCallback(
    (from: string, id: ApplicantModelNew['id']) => {
      setTasks((allTasks) => {
        const fromColumnTasks = allTasks[from as keyof typeof allTasks];
        const toColumnTasks = allTasks[column as keyof typeof allTasks];
        const movingTask = fromColumnTasks.find((task) => task.id === id);

        // console.log(`Moving task ${movingTask?.id} from ${from} to ${column}`);

        if (!movingTask) {
          return allTasks;
        }

        // remove the task from the original column and copy it within the destination column
        return {
          ...allTasks,
          [from]: fromColumnTasks.filter(
            (task: { id: string }) => task.id !== id
          ),
          [column]: [{ ...movingTask, column }, ...toColumnTasks],
        };
      });
    },
    [column, setTasks]
  );

  const swapTasks = useCallback(
    (i: number, j: number) => {
      debug(`Swapping task ${i} with ${j} in ${column} column`);
      setTasks((allTasks) => {
        const columnTasks = allTasks[column as keyof typeof allTasks];

        return {
          ...allTasks,
          [column]: swap(columnTasks, i, j),
        };
      });
    },
    [column, setTasks]
  );

  return {
    tasks: tasks[column as keyof typeof tasks],
    addEmptyTask,
    updateTask,
    dropTaskFrom,
    deleteTask,
    swapTasks,
  };
}

export default useColumnApplicants;
