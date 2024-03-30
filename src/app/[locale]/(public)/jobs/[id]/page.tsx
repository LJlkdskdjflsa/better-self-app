'use client';

import type { Resource } from 'i18next';
import { useEffect, useState } from 'react';

import initTranslations from '~/i18n';
import JobListingBoard from '~/lib/components/jobs/JobListingBoard';

const i18nNamespaces = ['common', 'position'];

function JobListingPage({
  params: { id, locale },
}: {
  params: { id: string; locale: string };
}) {
  const [i18nResources, setI18nResources] = useState<Resource | null>(null);

  useEffect(() => {
    const loadResources = async () => {
      const { resources } = await initTranslations(locale, i18nNamespaces);
      setI18nResources(resources);
    };

    loadResources();
  }, [locale]);

  if (!i18nResources) {
    return <div>Loading localization...</div>;
  }

  return <JobListingBoard postId={id} />;
}

export default JobListingPage;
