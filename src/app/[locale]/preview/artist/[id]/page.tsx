'use server';

import BackButton from '@/components/backButton';
import Header from '@/components/header';
import PreviewArtist from '@/components/preview/artist';
import { headers } from 'next/headers';

interface PreviewArtistPageProps {
  params: Promise<{
    id: string;
  }>;
}

const PreviewArtistPage = async ({ params }: PreviewArtistPageProps) => {
  const locale = (await headers()).get('locale') || 'fr';
  const { id } = await params;

  return (
    <div>
      <Header locale={locale} />
      <div style={{ display: 'flex', margin: '20px 0 0 35px' }}>
        <BackButton locale={locale} />
      </div>
      <PreviewArtist locale={locale} id={id} />
    </div>
  );
};

export default PreviewArtistPage;
