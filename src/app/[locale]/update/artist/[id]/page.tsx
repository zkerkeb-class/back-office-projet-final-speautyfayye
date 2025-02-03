'use server';

import Header from '@/components/header';
import UpdateArtistForm from '@/components/update/artist';
import { headers } from 'next/headers';

interface UpdateArtistPageProps {
  params: Promise<{
    id: string;
  }>;
}

const UpdateArtistPage = async ({ params }: UpdateArtistPageProps) => {
  const locale = (await headers()).get('locale') || 'fr';
  // const id = (await headers()).get('id') || '1';
  const { id } = await params;

  return (
    <div>
      <Header locale={locale} />
      {/* <h1>
        <Text locale={locale} text="title.form_update_artist" />
      </h1> */}
      <UpdateArtistForm id={id} locale={locale} />
    </div>
  );
};

export default UpdateArtistPage;
