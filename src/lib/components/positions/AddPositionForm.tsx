import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Select,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

interface AddPositionFormProps {
  onClose: () => void;
}

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
export default function AddPositionForm({ onClose }: AddPositionFormProps) {
  const toast = useToast();
  const {
    handleSubmit,
    register,
    formState: {
      //   errors,
      isSubmitting,
    },
  } = useForm<IFormValues>({
    defaultValues: {
      city: '預設城市',
      state_id: 1,
      country_id: 1,
      company_id: 1,
      // Add default values for other fields as needed
    },
  });

  const onSubmit: SubmitHandler<IFormValues> = async (values) => {
    try {
      await axios.post('http://127.0.0.1:8001/api/positions/company', values, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer AFG9JxtaRz79cjLZnhuz406uypiae6',
        },
      });

      toast({
        title: '職位已成功新增',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });

      onClose();
    } catch (error) {
      toast({
        title: '新增職位失敗',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={4}>
        <FormControl>
          <Input
            id="job_title"
            placeholder="職稱"
            {...register('job_title', {
              required: 'Required',
            })}
          />
        </FormControl>
        <FormControl>
          <Input
            id="department"
            placeholder="部門"
            {...register('department', {
              required: 'Required',
            })}
          />
        </FormControl>

        <FormControl>
          <Select
            id="job_type"
            placeholder="工作性質"
            {...register('job_type', {
              required: 'Required',
            })}
          >
            <option value="full-time">全職</option>
            <option value="part-time">兼職</option>
            <option value="contract">約聘</option>
          </Select>
        </FormControl>

        <FormControl>
          <Textarea
            id="responsibilities"
            placeholder="職位介紹"
            {...register('responsibilities', {
              required: 'Required',
            })}
          />
        </FormControl>

        <FormControl>
          <Textarea
            id="requirements"
            placeholder="職位要求"
            {...register('requirements', {
              required: 'Required',
            })}
          />
        </FormControl>

        <Flex justifyContent="flex-end" mt={4}>
          <Button onClick={onClose} colorScheme="red">
            取消
          </Button>
          <Box w={4} />
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isSubmitting}
            mr={2}
          >
            確認
          </Button>
        </Flex>
      </VStack>
    </form>
  );
}
