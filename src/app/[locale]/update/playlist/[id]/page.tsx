'use server';

import Header from '@/components/header';
import UpdatePlaylistForm from '@/components/update/playlist';
import { headers } from 'next/headers';

interface UpdatePlaylistPageProps {
  params: Promise<{
    id: string;
  }>;
}

const UpdatePlaylistPage = async ({ params }: UpdatePlaylistPageProps) => {
  const locale = (await headers()).get('locale') || 'fr';
  const { id } = await params;

  return (
    <div>
      <Header locale={locale} />
      <UpdatePlaylistForm id={id} locale={locale} />
    </div>
  );
};

export default UpdatePlaylistPage;
