import type { UseToastOptions } from '@chakra-ui/react';

type ToastFunction = (options: UseToastOptions) => void;

type ToastFunctionProps = (
  toast: ToastFunction,
  title: string,
  description: string
) => void;

// Implementation of the toastError utility function
export const toastError: ToastFunctionProps = (toast, title, description) => {
  toast({
    title,
    description,
    status: 'error',
    duration: 5000,
    isClosable: true,
    position: 'top', // Optional: Adjust the position as needed
  });
};

export const toastSuccess: ToastFunctionProps = (toast, title, description) => {
  toast({
    title,
    description,
    status: 'success',
    duration: 5000,
    isClosable: true,
    position: 'top', // Optional: Adjust the position as needed
  });
};
