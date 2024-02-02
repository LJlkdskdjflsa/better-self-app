import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spacer,
  TabPanel,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import type { Company } from '../dashboard/models/profileModel';

// interface CompanyTabProps {}

const CompanyTab: React.FC = () => {
  const [company, setCompany] = useState<Company>({} as Company);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  // update the company state with the company data from the API
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setCompany(data.data.company));
  }, []);

  if (Object.keys(company).length === 0) {
    return <div>Loading...</div>;
  }

  // Handler for form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompany((prevCompany) => ({
      ...prevCompany,
      [name]: value,
    }));
  };

  // Handler for form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsSubmitting(true);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/${company.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify(company),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsSubmitting(false);
        if (data.success) {
          // Handle success scenario
          toast({
            title: '更新成功',
            description: 'Company details updated successfully',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top',
          });
        } else {
          // Handle failure scenario
          toast({
            title: '更新失敗',
            description:
              data.error_message || 'Failed to update company details',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top',
          });
        }
      })
      .catch((error) => {
        setIsSubmitting(false);
        toast({
          title: '更新失敗',
          description: `An error occurred: ${error.message}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TabPanel>
        <FormControl>
          <Text fontSize="xl">公司簡介</Text>

          <Divider pt={10} />

          <Flex>
            <Text pt={5} fontSize="lg">
              基本資料
            </Text>
            <Spacer />
            {/* Add a submit button */}
            <Button
              mt={4}
              colorScheme="blue"
              isLoading={isSubmitting}
              type="submit"
            >
              更新資料
            </Button>
          </Flex>

          <Box m={5}>
            {/* Each input field now has a name attribute and an onChange handler */}
            <FormControl id="companyName">
              <FormLabel>公司名稱</FormLabel>
              <Input
                name="company"
                type="text"
                value={company.company || ''}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="website">
              <FormLabel>公司網頁</FormLabel>
              <Input
                name="domain"
                type="url"
                value={company.domain || ''}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="about">
              <FormLabel>關於公司</FormLabel>
              <Input
                name="description"
                type="text"
                value={company.description || ''}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="employees">
              <FormLabel>員工人數</FormLabel>
              <Input
                name="employees_number"
                type="number"
                value={company.employees_number || ''}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="phone">
              <FormLabel>電話</FormLabel>
              <Input
                name="phone_number"
                type="tel"
                value={company.phone_number || ''}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="address">
              <FormLabel>地址</FormLabel>
              <Input
                name="location_address"
                type="text"
                value={company.location_address || ''}
                onChange={handleChange}
              />
            </FormControl>
          </Box>
        </FormControl>
      </TabPanel>
    </form>
  );
};

export default CompanyTab;