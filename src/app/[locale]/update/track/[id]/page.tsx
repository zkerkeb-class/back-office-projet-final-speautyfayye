'use server';

import Header from '@/components/header';
import Text from '@/components/textLocale';
import UpdateTrackForm from '@/components/update/track';
import { headers } from 'next/headers';

interface UpdateTrackPageProps {
  params: Promise<{
    id: string;
  }>;
}

const UpdateTrackPage = async ({ params }: UpdateTrackPageProps) => {
  const locale = (await headers()).get('locale') || 'fr';
  const { id } = await params;

  return (
    <div>
      <Header locale={locale} />
      {/* <h1>
        <Text locale={locale} text="title.form_update_track" />
      </h1> */}
      <UpdateTrackForm id={id} locale={locale} />
    </div>
  );
};

export default UpdateTrackPage;
