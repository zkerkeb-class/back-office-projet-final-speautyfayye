// components/Header.tsx

'use client';

import Link from 'next/link';
import LanguageDropdown from '../languageDropdown';
import Text from '../textLocale';

interface HeaderProps {
  locale: string;
}

const Header = ({ locale }: HeaderProps) => {
  const isLogged = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = `/${locale}/login`;
  };

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
        {isLogged ? (
          <button onClick={logout}>
            <p>Se déconnecter</p>
          </button>
        ) : (
          <Link href={`/${locale}/login`}>
            <Text locale={locale} text="navigation.login" />
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
