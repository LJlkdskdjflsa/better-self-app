import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

interface IFormValues {
  job_title: string;
  responsibilities: string;
  requirements: string;
  department: string;
  job_type: string;
  city: string;
  state_id: number;
  country_id: number;
  company_id: number;
}
export default function HookForm() {
  const {
    handleSubmit,
    register,
    formState: {
      //   errors,
      isSubmitting,
    },
  } = useForm<IFormValues>();

  function onSubmit(values: IFormValues) {
    axios.post('http://127.0.0.1:8001/api/positions/company', values, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer AFG9JxtaRz79cjLZnhuz406uypiae6',
      },
    });
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <FormLabel htmlFor="job_title">Job Title</FormLabel>
        <Input
          id="job_title"
          placeholder="職稱"
          {...register('job_title', {
            required: 'Required',
          })}
        />
        {/* <FormErrorMessage>
                    {errors.job_title && errors.job_title.message}
                </FormErrorMessage> */}
      </FormControl>

      {/* Repeat for other fields */}
      <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
        Submit
      </Button>
    </form>
  );
}
