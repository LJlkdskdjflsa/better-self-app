import { FormControl, FormLabel, TabPanel, Text } from '@chakra-ui/react';

import type { ApplicantModelNew } from '../model';

interface PositionTabProps {
  task: ApplicantModelNew;
}

const PositionTab: React.FC<PositionTabProps> = ({ task }) => {
  return (
    <TabPanel>
      <FormControl>
        <FormLabel pt={5}>職位</FormLabel>
        <Text> {task.position.job}</Text>
        <FormLabel pt={5}>應徵日期</FormLabel>
        <Text> {task.apply_date}</Text>

        <FormLabel pt={5}>職位詳情</FormLabel>
        <Text> {task.position.responsibilities}</Text>

        <FormLabel pt={5}>職位需求</FormLabel>
        <Text> {task.position.requirements}</Text>
      </FormControl>
    </TabPanel>
  );
};

export default PositionTab;
