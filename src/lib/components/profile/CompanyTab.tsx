import {
  Box,
  Divider,
  FormControl,
  FormLabel,
  Input,
  TabPanel,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import type { Company } from '../dashboard/models/profileModel';

// interface CompanyTabProps {}

const CompanyTab: React.FC = () => {
  const [company, setCompany] = useState<Company>({} as Company);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setCompany(data.data.company));
  }, []);

  if (!company) {
    return <div>Loading...</div>;
  }
  return (
    <TabPanel>
      <FormControl>
        <Text fontSize="xl">公司簡介</Text>

        <Divider pt={10} />

        <Text pt={5} fontSize="lg">
          基本資料
        </Text>

        <Box m={5}>
          <FormControl id="companyName">
            <FormLabel>公司名稱</FormLabel>
            <Input type="text" value={company.company} />
          </FormControl>

          <FormControl id="website">
            <FormLabel>公司網頁</FormLabel>
            <Input type="url" value={company.domain} />
          </FormControl>

          <FormControl id="about">
            <FormLabel>關於公司</FormLabel>
            <Input type="text" value={company.description} />
          </FormControl>

          <FormControl id="employees">
            <FormLabel>員工人數</FormLabel>
            <Input type="number" value={company.employees_number} />
          </FormControl>

          <FormControl id="phone">
            <FormLabel>電話</FormLabel>
            <Input type="tel" value={company.phone_number || ''} />
          </FormControl>

          <FormControl id="address">
            <FormLabel>地址</FormLabel>
            <Input type="text" value={company.location_address || ''} />
          </FormControl>
        </Box>
      </FormControl>
    </TabPanel>
  );
};

export default CompanyTab;
