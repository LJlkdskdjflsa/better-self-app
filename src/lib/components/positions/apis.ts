import type { UseToastOptions } from '@chakra-ui/react';
import axios from 'axios';

type ToastFunction = (options: UseToastOptions) => void;
export const fetchPositions = async () => {
  // const { token } = useAuth();
  // console.log('try to fetch positions');
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/positions/company`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    }
  );
  return data.data;
};

export const fetchDeletedPositions = async () => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/positions/company?deleted=only`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    }
  );
  return data.data;
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
