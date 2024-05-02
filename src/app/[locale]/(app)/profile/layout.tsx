import initTranslations from '~/i18n';
import TranslationsProvider from '~/lib/components/TranslationsProvider';

type RootLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

const i18nNamespaces = ['profile', 'common'];

const Layout = async ({ children, params: { locale } }: RootLayoutProps) => {
  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      {children}
    </TranslationsProvider>
  );
};

export default Layout;
