'use client';

import { FormControl, FormLabel, TabPanel, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next'; // Import useTranslation

import type { ApplicantModelNew } from '../models/applicantModel';

interface PositionTabProps {
  task: ApplicantModelNew;
}

const PositionTab: React.FC<PositionTabProps> = ({ task }) => {
  const { t } = useTranslation('common'); // Use the common namespace

  return (
    <TabPanel>
      <FormControl>
        <FormLabel pt={5}>{t('common:position')}</FormLabel>
        <Text> {task.position.job}</Text>
        <FormLabel pt={5}>{t('common:application-date')}</FormLabel>
        <Text> {task.apply_date}</Text>

        <FormLabel pt={5}>{t('common:detail')}</FormLabel>
        <Text> {task.position.responsibilities}</Text>

        <FormLabel pt={5}>{t('position:position-requirement')}</FormLabel>
        <Text> {task.position.requirements}</Text>
      </FormControl>
    </TabPanel>
  );
};

export default PositionTab;
