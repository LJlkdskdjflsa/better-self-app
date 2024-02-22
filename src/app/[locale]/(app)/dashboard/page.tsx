'use client';

import {} from '@chakra-ui/icons';
import { Container, SimpleGrid } from '@chakra-ui/react';
import axios from 'axios';
import type { Resource } from 'i18next';
import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import initTranslations from '~/i18n';
import Column from '~/lib/components/dashboard/Column';
import type { ApplicantStatus } from '~/lib/components/dashboard/models/applicantModel';
import { useAuth } from '~/lib/components/hooks/useAuth';
import useApplicantsStore from '~/lib/store/applicantsStore';

const i18nNamespaces = ['dashboard', 'common', 'position'];

export default function DashboardPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  useAuth('/');
  const [columnType, setColumnType] = useState([]);
  const { applicants, fetchApplicants } = useApplicantsStore((state) => ({
    applicants: state.applicants,
    fetchApplicants: state.getApplicantsFromApi,
  }));
  const [i18nResources, setI18nResources] = useState<Resource | null>(null);

  useEffect(() => {
    if (!applicants) fetchApplicants();
  }, [applicants, fetchApplicants]);

  // i18n
  useEffect(() => {
    const loadResources = async () => {
      const { resources } = await initTranslations(locale, i18nNamespaces);
      setI18nResources(resources);
    };

    loadResources();
  }, [locale]);

  useEffect(() => {
    // if token is in localstorage

    const fetchColumnType = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/positionapps/statuses/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      if (response.data.success) {
        setColumnType(response.data.data.map((item: ApplicantStatus) => item));
      }
    };

    if (localStorage.getItem('accessToken')) {
      fetchColumnType();
    }
  }, []);

  if (!i18nResources) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <DndProvider backend={HTML5Backend}>
        <Container maxWidth="container.lg" px={4} py={10}>
          <SimpleGrid
            columns={{ base: 1, md: 5 }}
            spacing={{ base: 16, md: 5 }}
          >
            {columnType.map((type) => (
              <Column key={type} column={type} />
            ))}
          </SimpleGrid>
        </Container>
      </DndProvider>
    </main>
  );
}
