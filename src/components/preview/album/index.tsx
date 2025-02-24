'use client';

import ErrorComponent from '@/components/error';
import StreamImage from '@/components/streamImage';
import Text from '@/components/textLocale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import useTranslation from '@/customHook/useTranslation';
import { AppDispatch, RootState } from '@/store';
import { fetchAlbum } from '@/store/slices/albumSlice';
import { fetchCategory } from '@/store/slices/categorySlice';
import { formatDate } from '@/utils/helpers';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface PreviewAlbumProps {
  locale: string;
  id: string;
}

const PreviewAlbum = ({ locale, id }: PreviewAlbumProps) => {
  const { t } = useTranslation(locale);
  const { album, loading, error } = useSelector((state: RootState) => state.selectedAlbum);
  const { category } = useSelector((state: RootState) => state.selectedCategory);
  const dispatch = useDispatch<AppDispatch>();
  const [showImageCard, setShowImageCard] = useState(false);

  useEffect(() => {
    dispatch(fetchAlbum(id));
  }, [dispatch]);

  useEffect(() => {
    if (album) {
      dispatch(fetchCategory(album.category_id.toString()));
    }
  }, [album]);

  const toggleImageCard = () => {
    setShowImageCard(!showImageCard);
  };

  return (
    <div className="flex flex-col items-stretch">
      {error && <ErrorComponent message={error} locale={locale} />}
      {loading && (
        <div>
          <Text locale={locale} text="messages.loading" />
        </div>
      )}
      {album && category && (
        <div className="flex">
          <Card className="mx-auto mt-10 w-[400px]">
            <CardHeader>
              <div className="text-center text-2xl font-bold">
                <h2>{album?.title}</h2>
              </div>
              <div className="text-center text-lg font-semibold">
                <Link href={`/${locale}/preview/artist/${album?.artist?.id}`}>
                  by {album?.artist?.name}
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Sortie le </Label>
                <Label>{formatDate(album.releaseDate, locale)}</Label>
              </div>
              <div className="space-y-2">
                <Label>Genre musical: </Label>
                <Label>{category.name}</Label>
              </div>

              {album.picture && (
                <Button onClick={toggleImageCard}>
                  {showImageCard ? t('global.hideAlbumImage') : t('global.showAlbumImage')}
                </Button>
              )}
            </CardContent>
          </Card>
          <Card className="mx-auto mt-10 w-[400px]">
            <CardHeader>
              <h2 className="text-center text-2xl font-bold">
                <Text locale={locale} text="title.albumMusic" />
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {album.tracks && (
                <div className="space-y-2">
                  <Label>Nombre de pistes: </Label>
                  <Label>{album.tracks.length}</Label>
                </div>
              )}
              {album.tracks &&
                album.tracks.map((item, index) => (
                  <div className="rounded border bg-gray-100 p-2 shadow-sm" key={index}>
                    {item.title}
                  </div>
                ))}
            </CardContent>
          </Card>
          {showImageCard && album.picture && (
            <Card className="w-[400]px mx-auto mt-10">
              <CardHeader>
                <div className="text-center text-2xl font-bold">
                  <Text locale={locale} text="title.profilPicture" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <StreamImage size={200} imageId={album.picture} />
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default PreviewAlbum;
