'use client';

import ErrorComponent from '@/components/error';
import StreamImage from '@/components/streamImage';
import Text from '@/components/textLocale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import useTranslation from '@/customHook/useTranslation';
import { AppDispatch, RootState } from '@/store';
import { fetchArtist } from '@/store/slices/artistSlice';
import { fetchCategory } from '@/store/slices/categorySlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface PreviewArtistProps {
  locale: string;
  id: string;
}

const PreviewArtist = ({ locale, id }: PreviewArtistProps) => {
  const { t } = useTranslation(locale);
  const { artist, loading, error } = useSelector((state: RootState) => state.selectedArtist);
  const { category } = useSelector((state: RootState) => state.selectedCategory);
  const dispatch = useDispatch<AppDispatch>();
  const [showImageCard, setShowImageCard] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    dispatch(fetchArtist(id));
  }, [dispatch]);

  useEffect(() => {
    if (artist) {
      dispatch(fetchCategory(artist.category_id.toString()));
    }
  }, [artist]);

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
      {artist && category && (
        <div className="flex">
          <Card className="mx-auto mt-10 w-[400px]">
            <CardHeader>
              <div className="text-center text-2xl font-bold">
                <h2>{artist.name}</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Biographie: </Label>

                {expanded ? (
                  <div className="rounded border bg-gray-100 p-2 shadow-sm">
                    {artist.bio}&nbsp;
                    <button
                      onClick={() => setExpanded(!expanded)}
                      className="text-blue-500 hover:underline"
                    >
                      Voir moins
                    </button>
                  </div>
                ) : (
                  <div className="rounded border bg-gray-100 p-2 shadow-sm">
                    {artist.bio.slice(0, 250)}
                    {!expanded && '... '}
                    <button
                      onClick={() => setExpanded(!expanded)}
                      className="text-blue-500 hover:underline"
                    >
                      Voir plus
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Genre musical: </Label>
                <Label>{category.name}</Label>
              </div>

              {artist.picture && (
                <Button onClick={toggleImageCard}>
                  {showImageCard ? t('global.hideArtistImage') : t('global.showArtistImage')}
                </Button>
              )}
            </CardContent>
          </Card>
          <Card className="mx-auto mt-10 w-[400px]">
            <CardHeader>
              <h2 className="text-center text-2xl font-bold">
                <Text locale={locale} text="title.artistMusic" />
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {artist.tracks && (
                <div className="space-y-2">
                  <Label>Nombre de pistes: </Label>
                  <Label>{artist.tracks.length}</Label>
                </div>
              )}
              {artist.tracks &&
                artist.tracks.map((item, index) => (
                  <div className="rounded border bg-gray-100 p-2 shadow-sm" key={index}>
                    {item.title}
                  </div>
                ))}
            </CardContent>
          </Card>
          {showImageCard && artist.picture && (
            <Card className="w-[400]px mx-auto mt-10">
              <CardHeader>
                <div className="text-center text-2xl font-bold">
                  <Text locale={locale} text="title.profilPicture" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <StreamImage size={200} imageId={artist.picture} />
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default PreviewArtist;
