'use client';

import { FormControl, FormLabel, TabPanel, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next'; // Import useTranslation

import { useUserProfile } from '../../hooks/useUserProfile';
import type { ApplicantModelNew } from '../models/applicantModel';
import { transferUtcTimestampToLocalDatetime } from '~/utils/timeUtils';

interface PositionTabProps {
  task: ApplicantModelNew;
}

const PositionTab: React.FC<PositionTabProps> = ({ task }) => {
  const { t } = useTranslation('common'); // Use the common namespace
  const { profile: userProfile, isLoading } = useUserProfile();

  const readableDate = transferUtcTimestampToLocalDatetime(task.apply_date);
  if (isLoading) {
    return <div>{t('loading')}</div>;
  }

  const showApplicationNote = userProfile?.company.can_use_application_note;
  return (
    <TabPanel>
      <FormControl>
        <FormLabel pt={5}>{t('common:position')}</FormLabel>
        <Text> {task.position.job}</Text>
        <FormLabel pt={5}>{t('common:application-date')}</FormLabel>
        <Text> {readableDate}</Text>

        <FormLabel pt={5}>{t('common:detail')}</FormLabel>
        <Text> {task.position.responsibilities}</Text>

        <FormLabel pt={5}>{t('position:position-requirement')}</FormLabel>
        <Text> {task.position.requirements}</Text>

        {showApplicationNote && (
          <>
            <FormLabel pt={5}>{t('common:application-note')}</FormLabel>
            <Text> {task.application_note}</Text>
          </>
        )}
      </FormControl>
    </TabPanel>
  );
};

export default PositionTab;
