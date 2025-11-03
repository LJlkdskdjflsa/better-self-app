'use client';

import { Flex, Box } from '@chakra-ui/react';
import { useState } from 'react';

import { useAuth } from '~/lib/components/hooks/useAuth';
import NewRecordForm from '~/lib/components/newRecord/NewRecordForm';
import { TemplateGrid } from '~/lib/components/recordTemplate/TemplateGrid';
import type { CreateRecordTemplateRequest } from '~/lib/types/recordTemplate';

interface FormData {
  title: string;
  startTime: string;
  endTime: string;
  focus: number;
  point: number;
  note: string;
  tag_ids: string[];
}

const INITIAL_FORM_DATA: FormData = {
  title: '',
  startTime: '',
  endTime: '',
  focus: 0,
  point: 0,
  note: '',
  tag_ids: [],
};

const Home = () => {
  useAuth('/');

  // State for desktop split-view coordination
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );

  const handleTemplateSelect = (template: CreateRecordTemplateRequest) => {
    setFormData((prev) => ({
      ...prev,
      title: template.title,
      focus: template.focus,
      point: template.point,
      note: template.note || '',
      tag_ids: template.tag_ids || [],
      // Preserve startTime and endTime from user input
    }));
    setSelectedTemplateId(template.id);
  };

  const handleRecordCreated = () => {
    // Reset form and selection after successful submission
    setFormData(INITIAL_FORM_DATA);
    setSelectedTemplateId(null);
  };

  return (
    <>
      {/* Desktop: Split-view layout (form left, templates right) */}
      <Flex
        display={{ base: 'none', md: 'flex' }}
        gap={6}
        w="full"
        maxW="1400px"
        mx="auto"
        minHeight="70vh"
        px={6}
        py={8}
      >
        <Box flex={1} minW={0} maxW="600px">
          <NewRecordForm
            formData={formData}
            setFormData={setFormData}
            onRecordCreated={handleRecordCreated}
          />
        </Box>
        <Box flex={1} minW={0} maxW="500px" maxH="80vh" overflowY="auto" px={2}>
          <TemplateGrid
            onTemplateSelect={handleTemplateSelect}
            selectedTemplateId={selectedTemplateId}
          />
        </Box>
      </Flex>

      {/* Mobile: Single-column layout (form only, current behavior) */}
      <Flex
        display={{ base: 'flex', md: 'none' }}
        direction="column"
        alignItems="center"
        justifyContent="center"
        minHeight="70vh"
        gap={4}
        mb={8}
        w="full"
      >
        <NewRecordForm />
      </Flex>
    </>
  );
};

export default Home;
