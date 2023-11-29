import { SimpleGrid } from '@chakra-ui/react';

import type { RecordTemplate } from '~/lib/types/recordTemplate';

import TemplateButton from './TemplateButton';

const templates: RecordTemplate[] = [
  { title: 'Sleep', focus: 2, point: 3, note: null },
  { title: 'Work', focus: 4, point: 4, note: null },
  { title: 'Rest', focus: 2, point: 3, note: null },
  { title: 'Social', focus: 3, point: 2, note: null },
  { title: 'Traffic', focus: 2, point: 2, note: null },
  { title: 'Entertainment', focus: 3, point: 2, note: null },
  { title: 'Exercise', focus: 4, point: 4, note: null },
];

export const TemplateGrid = () => {
  return (
    <SimpleGrid columns={3} spacing={10}>
      {templates.map((template) => (
        <TemplateButton key={template.title} template={template} />
      ))}
    </SimpleGrid>
  );
};
