import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';

import { useUserProfile } from '../hooks/useUserProfile';

import type { Position } from './interfaces';

interface CreateUpdatePositionFormProps {
  onClose: () => void;
  position?: IFormValues; // 新增一個 position 屬性
}

interface IFormValues {
  id?: number;
  position_id?: number;
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

export default function CreateUpdatePositionForm({
  onClose,
  position,
}: CreateUpdatePositionFormProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const toast = useToast();
  const { data: userProfile, isLoading } = useUserProfile(); // Destructure to get data and isLoading

  const {
    handleSubmit,
    register,
    setValue,
    formState: { isSubmitting },
  } = useForm<IFormValues>({
    defaultValues: position || {
      // 如果有傳遞 position 對象，則使用該對象作為默認值
      city: 'defaut-city',
      state_id: 1,
      country_id: 1,
      company_id: 1,
      // Add default values for other fields as needed
    },
  });

  useEffect(() => {
    if (position) {
      // 如果有傳遞 position 對象，則將表單的值設置為該對象的值
      Object.entries(position).forEach(([key, value]) => {
        setValue(key as keyof IFormValues, value);
      });
    }
  }, [position, setValue]);

  const onSubmit: SubmitHandler<IFormValues> = async (values) => {
    try {
      if (position) {
        // 如果有傳遞 position 對象，則發送 PATCH 請求來更新該職位
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/positions/company`,
          {
            position_id: values.id,
            ...values,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        );
      } else {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/positions/company`,
          {
            ...values,
            company_id: userProfile?.company?.id,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        );

        // if response success
        const existingPositions =
          queryClient.getQueryData<Position[]>('positions');
        if (existingPositions) {
          queryClient.setQueryData<Position[]>('positions', [
            ...existingPositions,
            response.data.data,
          ]);
        }
      }

      toast({
        title: position
          ? t('common:update-completed')
          : t('common:create-completed'),
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });

      onClose();
    } catch (error) {
      toast({
        title: position ? t('common:update-failed') : t('common:create-failed'),
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
          <FormControl>
            <Input
              id="job_title"
              placeholder="職稱"
              {...register('job_title', {
                required: 'Required',
              })}
            />
          </FormControl>
        </FormControl>
        <FormControl>
          <Input
            id="department"
            placeholder={t('department')}
            {...register('department', {
              required: 'Required',
            })}
          />
        </FormControl>

        <FormControl>
          <Select
            id="job_type"
            // placeholder="工作性質"
            {...register('job_type', {
              required: 'Required',
            })}
          >
            <option value="full-time">{t('full-time')}</option>
            <option value="part-time">{t('part-time')}</option>
            <option value="contract">{t('contract')}</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel
            htmlFor="responsibilities"
            {...register('responsibilities', {
              required: 'Required',
            })}
          >
            {t('common:responsibilities')}
          </FormLabel>
          <Textarea
            id="responsibilities"
            {...register('responsibilities', {
              required: 'Required',
            })}
          />
        </FormControl>

        <FormControl>
          <FormLabel
            htmlFor="requirements"
            {...register('requirements', {
              required: 'Required',
            })}
          >
            {t('common:requirements')}
          </FormLabel>

          <Textarea
            id="requirements"
            {...register('requirements', {
              required: 'Required',
            })}
          />
        </FormControl>

        <Flex justifyContent="flex-end" mt={4}>
          <Button onClick={onClose} colorScheme="red">
            {t('common:cancel')}
          </Button>
          <Box w={4} />
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isLoading || isSubmitting}
            disabled={isLoading || isSubmitting}
            mr={2}
          >
            {t('common:confirm')}
          </Button>
        </Flex>
      </VStack>
    </form>
  );
}
