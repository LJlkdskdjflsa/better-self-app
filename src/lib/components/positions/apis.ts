import type { UseToastOptions } from '@chakra-ui/react';
import axios from 'axios';

type ToastFunction = (options: UseToastOptions) => void;
export const fetchPositions = async ({
  page = 1,
  pageSize = 10,
  deleted = false,
} = {}) => {
  const deletedQueryParam = deleted ? 'deleted=only' : '';
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/positions/company?page_size=${pageSize}&page=${page}&${deletedQueryParam}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    }
  );
  return data;
};

export async function restorePosition(
  positionId: number,
  toast: ToastFunction
) {
  // log all the request
  // debug(localStorage.getItem('accessToken'))

  try {
    // Assuming you have an API endpoint to restore a position
    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/positions/company`,
      {
        position_id: positionId,
        is_deleted: false,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );

    toast({
      title: 'Position restored successfully',
      description: 'The position has been restored.',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top',
    });

    // Refresh the list of positions or update state to reflect the change
  } catch (error) {
    toast({
      title: 'Failed to restore position',
      description: 'An error occurred while trying to restore the position.',
      status: 'error',
      duration: 3000,
      isClosable: true,
      position: 'top',
    });
  }
}
