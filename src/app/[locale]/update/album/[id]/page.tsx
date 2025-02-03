'use server';

import Header from '@/components/header';
import Text from '@/components/textLocale';
import UpdateAlbumForm from '@/components/update/album';
import { headers } from 'next/headers';

interface UpdateAlbumPageProps {
  params: Promise<{
    id: string;
  }>;
}

const UpdateAlbumPage = async ({ params }: UpdateAlbumPageProps) => {
  const locale = (await headers()).get('locale') || 'fr';
  const { id } = await params;

  return (
    <div>
      <Header locale={locale} />
      <h1>
        <Text locale={locale} text="title.form_update_album" />
      </h1>
      <UpdateAlbumForm id={id} locale={locale} />
    </div>
  );
};

export default UpdateAlbumPage;
