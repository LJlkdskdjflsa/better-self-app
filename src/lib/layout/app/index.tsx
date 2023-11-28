'use client';

import type { ReactNode } from 'react';

import AppFooter from './AppFooter';
import AppHeader from './AppHeader';

type LayoutProps = {
  children: ReactNode;
};

const AppLayout = ({ children }: LayoutProps) => {
  return (
    <>
      <AppHeader />
      {children}
      <AppFooter />
    </>
  );
};

export default AppLayout;
