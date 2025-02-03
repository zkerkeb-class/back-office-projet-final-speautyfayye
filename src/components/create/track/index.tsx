'use client';

import ErrorComponent from '@/components/error';
import Text from '@/components/textLocale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useTranslation from '@/customHook/useTranslation';
import { AppDispatch, RootState } from '@/store';
import { fetchAllCategories } from '@/store/slices/categorySlice';
import { uploadAudio } from '@/utils/upload';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface Props {
  locale: string;
}

const TrackForm = ({ locale }: Props) => {
  const { t } = useTranslation(locale);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.selectedCategory);
  const [id, setId] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const { loading, error } = useSelector((state: RootState) => state.selectedTrack);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...Object.fromEntries(formData), audio: id, duration }),
    });
    if (response.ok) {
      router.push(`/${locale}/dashboard?tab=tracks`);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;
    const audioId = await uploadAudio(files);
    setId(audioId);

    const audio = new Audio();
    const objectURL = URL.createObjectURL(files[0]);
    audio.src = objectURL;

    audio.onloadedmetadata = () => {
      setDuration(audio.duration);
      URL.revokeObjectURL(objectURL);
    };
  };

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  return (
    <Card className="mx-auto mt-10 w-[400px]">
      <CardHeader>
        <h2 className="text-center text-2xl font-bold">
          <Text locale={locale} text="title.form_create_track" />
        </h2>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="audio">
              <Text locale={locale} text="tables.key.audio" />
            </Label>
            <Input id="audio" type="file" onChange={handleFileChange} accept=".mp3" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">
              <Text locale={locale} text="tables.key.title" />
            </Label>
            <Input id="title" name="title" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="releaseDate">
              <Text locale={locale} text="tables.key.releaseDate" />
            </Label>
            <Input type="date" id="releaseDate" name="releaseDate" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_id">
              <Text locale={locale} text="tables.key.category_id" />
            </Label>
            <Select name="category_id">
              <SelectTrigger>
                <SelectValue placeholder={t('select.category')} />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="album_id">
              <Text locale={locale} text="tables.key.album_id" />
            </Label>
            <Input type="number" id="album_id" name="album_id" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lyrics">
              <Text locale={locale} text="tables.key.lyrics" />
            </Label>
            <Input id="lyrics" name="lyrics" />
          </div>

          <input type="hidden" name="audio" value={id || ''} />
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <Text locale={locale} text="create.loading" />
            ) : (
              <Text locale={locale} text="create.track" />
            )}
          </Button>
        </CardFooter>
      </form>
      {error && <ErrorComponent message={error} locale={locale} />}
    </Card>
  );
};

export default TrackForm;
