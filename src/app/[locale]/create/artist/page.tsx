'use server';

import CreateArtistForm from '@/components/create/artist';
import Header from '@/components/header';
import { headers } from 'next/headers';
import React from 'react';

const CreateArtistPage: React.FC = async () => {
  const locale = (await headers()).get('locale') || 'fr';

  return (
    <div>
      <Header locale={locale} />
      <CreateArtistForm locale={locale} />
    </div>
  );
};

export default CreateArtistPage;
