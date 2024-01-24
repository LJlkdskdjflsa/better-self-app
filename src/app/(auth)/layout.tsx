import AuthNav from '~/lib/layout/AuthNav';

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <>
      <AuthNav />
      {children}
    </>
  );
};

export default RootLayout;
