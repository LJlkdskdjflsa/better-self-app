// @ts-ignore
import axios from 'axios';
import { useEffect, useState } from 'react';

import type { ApplicantBoardModel } from '../model';
import { formatData } from '../utils/formData';

type SetTaskType = React.Dispatch<React.SetStateAction<ApplicantBoardModel>>;

function useApplicantCollection(): [ApplicantBoardModel, SetTaskType] {
  const [tasks, setTasks] = useState<ApplicantBoardModel>({});

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          'http://127.0.0.1:8001/api/positionapps/',
          {
            headers: { Authorization: 'Bearer AFG9JxtaRz79cjLZnhuz406uypiae6' },
          }
        );
        if (response.data.success) {
          const formattedTasks = formatData(response.data.data);
          // console.log(formattedTasks);
          setTasks(formattedTasks);
        } else {
          // eslint-disable-next-line no-console
          console.error('Failed to fetch tasks: ', response.data.error_message);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching tasks: ', error);
      }
    };

    fetchTasks();
  }, []);

  // const formatTasks = (data) => {

  //   return newTasks;
  // };

  return [tasks, setTasks];
}

export default useApplicantCollection;
