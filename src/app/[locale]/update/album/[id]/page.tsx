'use server';

import BackButton from '@/components/backButton';
import Header from '@/components/header';
import UpdateAlbumForm from '@/components/update/album';
import UpdateAlbumOrder from '@/components/updateOrder/album';
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
      <div style={{ display: 'flex', margin: '20px 0 0 35px' }}>
        <BackButton locale={locale} />
      </div>
      <div className="flex">
        <UpdateAlbumForm id={id} locale={locale} />
        <UpdateAlbumOrder id={id} locale={locale} />
      </div>
    </div>
  );
};

export default UpdateAlbumPage;
