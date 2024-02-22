import { Box, Tab, TabList, TabPanels, Tabs, Text } from '@chakra-ui/react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import CompanyTab from '~/lib/components/profile/CompanyTab';

const ProfileTabs: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Tabs orientation="vertical">
      <Box m={5}>
        <TabList>
          <Tab>
            <Text style={{ whiteSpace: 'nowrap' }}>{t('company-profile')}</Text>
          </Tab>
          {/* <Tab style={{ whiteSpace: 'nowrap' }}>設定</Tab> */}
        </TabList>
      </Box>

      <TabPanels>
        <CompanyTab />
      </TabPanels>
    </Tabs>
  );
};

export default ProfileTabs;
