import React from 'react';
import ClientLayout from './clientLayout';
import './globals.css';

export const metadata = {
  title: 'Speautyfayye',
  description: 'Speautyfayye',
};

const Layout = function RootLayout({ children }: { children: React.ReactNode }) {
  // const { t } = useTranslation('fr');
  return (
    <html lang="fr">
      <body>
        {/* <h1>{t('welcome')}</h1> */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
};

export default Layout;
