// components/Header.tsx

'use client';

import Link from 'next/link';
import LanguageDropdown from '../languageDropdown';
import Text from '../textLocale';

interface HeaderProps {
  locale: string;
}

const Header = ({ locale }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between bg-white p-4 shadow-md">
      <div className="text-2xl font-bold text-gray-800">
        <Link href="/" className="text-inherit no-underline">
          Speautyfayye
        </Link>
      </div>
      <nav className="ml-8 flex-1">
        <ul className="m-0 flex list-none gap-6 p-0">
          <li>
            <Link className="font-medium text-gray-800 no-underline" href={`/${locale}/dashboard`}>
              <Text locale={locale} text="navigation.dashboard" />
            </Link>
          </li>
          <li>
            <Link className="font-medium text-gray-800 no-underline" href={`/${locale}/system`}>
              <Text locale={locale} text="navigation.system" />
            </Link>
          </li>
        </ul>
      </nav>
      <div className="flex items-center gap-4">
        <LanguageDropdown locale={locale} />
        <a
          href="/login"
          className="rounded border border-gray-300 p-2 font-medium text-gray-700 no-underline"
        >
          <Text locale={locale} text="navigation.login" />
        </a>
      </div>
    </header>
  );
};

export default Header;
