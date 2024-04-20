'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import i18nConfig from '../../../i18nConfig';

export default function LanguageChanger() {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const router = useRouter();
  const currentPathname = usePathname();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;

    // set cookie for next-i18n-router
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = date.toUTCString();

    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

    // redirect to the new locale path
    if (currentLocale === i18nConfig.defaultLocale) {
      //   console.log('first');
      router.push(`/${newLocale}/${currentPathname}`);
    } else {
      if (currentLocale === newLocale) {
        return;
      }

      router.push(
        currentPathname.replace(`/${currentLocale}`, `/${newLocale}`)
      );
    }

    router.refresh();
  };

  return (
    <select onChange={handleChange} value={currentLocale}>
      <option value="en">English</option>
      <option value="zh">繁體中文</option>
      <option value="fr">French</option>
      <option value="nl">Dutch</option>
      <option value="ja">日本語 (Japanese)</option>
      <option value="pt">Portuguese</option>
    </select>
  );
}
