'use server';

import TrackForm from '@/components/create/track';
import Header from '@/components/header';
import Text from '@/components/textLocale';
import { headers } from 'next/headers';
import React from 'react';

const CreateAlbumPage: React.FC = async () => {
  const locale = (await headers()).get('locale') || 'fr';

  return (
    <div>
      <Header locale={locale} />
      <h1>
        <Text locale={locale} text="title.form_create_album" />
      </h1>
      <TrackForm locale={locale} />
    </div>
  );
};

export default CreateAlbumPage;
