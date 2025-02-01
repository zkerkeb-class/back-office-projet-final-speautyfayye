'use server';

import CreateArtistForm from '@/components/create/artist';
import Header from '@/components/header';
import Text from '@/components/textLocale';
import { headers } from 'next/headers';
import React from 'react';

const CreateArtistPage: React.FC = async () => {
  const locale = (await headers()).get('locale') || 'fr';

  return (
    <div>
      <Header locale={locale} />
      <h1>
        <Text locale={locale} text="title.form_create_artist" />
      </h1>
      <CreateArtistForm locale={locale} />
    </div>
  );
};

export default CreateArtistPage;
