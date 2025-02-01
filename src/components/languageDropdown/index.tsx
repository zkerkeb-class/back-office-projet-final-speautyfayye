'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ChangeEvent } from 'react';

interface LanguageDropdownProps {
  locale: string;
}

const LanguageDropdown = ({ locale }: LanguageDropdownProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const onSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    return router.push(`/${e.target.value}/${pathname.split('/')[2]}`);
  };

  return (
    <div className="language-dropdown">
      <select
        value={locale}
        onChange={(e) => onSelect(e)}
        className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
      >
        <option value="fr">FR</option>
        <option value="gb">GB</option>
        <option value="ar">AR</option>
      </select>
    </div>
  );
};

export default LanguageDropdown;
