'use server';

import BackButton from '@/components/backButton';
import Header from '@/components/header';
import PreviewAlbum from '@/components/preview/album';
import { headers } from 'next/headers';

interface PreviewAlbumPageProps {
  params: Promise<{
    id: string;
  }>;
}

const PreviewAlbumPage = async ({ params }: PreviewAlbumPageProps) => {
  const locale = (await headers()).get('locale') || 'fr';
  const { id } = await params;

  return (
    <div>
      <Header locale={locale} />
      <div style={{ display: 'flex', margin: '20px 0 0 35px' }}>
        <BackButton locale={locale} />
      </div>
      <PreviewAlbum locale={locale} id={id} />
    </div>
  );
};

export default PreviewAlbumPage;
