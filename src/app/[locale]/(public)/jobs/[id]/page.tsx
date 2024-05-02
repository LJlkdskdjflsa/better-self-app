import JobListingBoard from '~/lib/components/jobs/JobListingBoard';

async function JobListingPage({
  params: { id },
}: {
  params: { id: string; locale: string };
}) {
  return <JobListingBoard postId={id} />;
}

export default JobListingPage;
