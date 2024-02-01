'use client';

import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';

import { useAuth } from '~/lib/components/hooks/useAuth';
import CompanyTab from '~/lib/components/profile/CompanyTab';

const PersonalDataPage = () => {
  useAuth('/');

  return (
    <Flex justify="center" align="center" height="100vh">
      <Box m={5} bgColor="white" w="90%" height="700px" borderRadius="xl">
        <Tabs orientation="vertical">
          <Box m={5}>
            <TabList>
              <Tab>
                <Text style={{ whiteSpace: 'nowrap' }}>公司簡介</Text>
              </Tab>
              <Tab style={{ whiteSpace: 'nowrap' }}>設定</Tab>
            </TabList>
          </Box>

          <TabPanels>
            <CompanyTab />
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
};

export default PersonalDataPage;
