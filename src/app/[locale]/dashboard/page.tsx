'use server';
import Header from '@/components/header';
import TablePicker from '@/components/tablePicker';
import { headers } from 'next/headers';
import { FC } from 'react';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Page: FC<PageProps> = async (props) => {
  const { searchParams: promise } = props;
  const locale = (await headers()).get('locale') || 'fr';
  const searchParams = await promise;

  return (
    <div>
      <Header locale={locale} />
      <div className="width-100 flex justify-center">
        <TablePicker
          locale={locale}
          tab={
            ['playlists', 'artists', 'albums'].includes(searchParams.tab as string)
              ? (searchParams.tab as 'playlists' | 'artists' | 'albums')
              : undefined
          }
        />
      </div>
    </div>
  );
};

export default Page;
