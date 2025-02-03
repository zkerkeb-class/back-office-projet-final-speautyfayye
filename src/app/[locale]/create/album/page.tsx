'use server';

import CreateAlbumForm from '@/components/create/album';
import Header from '@/components/header';
import { headers } from 'next/headers';
import React from 'react';

const CreateAlbumPage: React.FC = async () => {
  const locale = (await headers()).get('locale') || 'fr';

  return (
    <div>
      <Header locale={locale} />
      {/* <h1>
        <Text locale={locale} text="title.form_create_album" />
      </h1> */}
      <CreateAlbumForm locale={locale} />
    </div>
  );
};

export default CreateAlbumPage;
