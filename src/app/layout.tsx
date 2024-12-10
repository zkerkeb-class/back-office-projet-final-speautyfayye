import React from 'react';
import ClientLayout from './clientLayout';

export const metadata = {
  title: 'Speautyfayye',
  description: 'Speautyfayye',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
