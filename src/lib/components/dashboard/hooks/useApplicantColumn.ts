/* eslint-disable sonarjs/no-duplicate-string, react-hooks/exhaustive-deps */

import { useToast } from '@chakra-ui/react';
import { useCallback } from 'react';

import type { ApplicantModelNew, ColumnType } from '../models/applicanModel';
import { debug } from '../utils/logging';
import useApplicantsStore from '~/lib/store/applicantsStore';

function useColumnApplicants(column: ColumnType) {
  const {
    applicants,
    addNewApplicant,
    updateApplicantStatus,
    deleteApplicant,
  } = useApplicantsStore((state) => ({
    applicants: state.applicants,
    fetchApplicants: state.fetchApplicants,
    addNewApplicant: state.addNewApplicant,
    deleteApplicant: state.deleteApplicant,
    updateApplicantStatus: state.updateApplicantStatus,
    isLoading: state.isLoading,
  }));

  const toast = useToast();

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
      updateApplicantStatus(id, column);
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
    addNewTask: addNewApplicant,
    updateTask,
    dropTaskFrom,
    deleteTask,
    swapTasks,
  };
}

export default useColumnApplicants;
