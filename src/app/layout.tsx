import { Analytics } from '@vercel/analytics/react';
import type { Metadata, Viewport } from 'next';

import Providers from '~/app/providers';
import Layout from '~/lib/layout';

type RootLayoutProps = {
  children: React.ReactNode;
};

const APP_NAME = 'HR AI';

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: '%s | be better by recording your daily life',
  },
  description: 'HR AI is a app to record your daily life.',
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'HR AI',
    description: 'HR AI is a app to record your daily life',
    images: {
      url: 'https://og-image.sznm.dev/**nextarter-chakra**.sznm.dev.png?theme=dark&md=1&fontSize=125px&images=https%3A%2F%2Fsznm.dev%2Favataaars.svg&widths=250',
      alt: 'nextarter-chakra.sznm.dev og-image',
    },
  },
  twitter: {
    creator: '@sozonome',
    card: 'summary_large_image',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FFFFFF',
};

const RootLayout = ({ children }: RootLayoutProps) => {
  const { setColorMode } = useColorMode();

  useEffect(() => {
    setColorMode('light');
  }, [setColorMode]);
  return (
    <html lang="en">
      <body>
        <Providers>
          <Layout>
            {children}
            <Analytics />
          </Layout>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
