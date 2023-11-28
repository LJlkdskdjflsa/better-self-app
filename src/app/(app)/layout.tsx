import { Analytics } from '@vercel/analytics/react';

import AppLayout from '~/lib/layout/app';

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <AppLayout>
      {children}
      <Analytics />
    </AppLayout>
  );
};

export default RootLayout;
