'use client';

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
import { Artist, fetchArtist, updateArtist } from '@/store/slices/artistSlice';
import { fetchAllCategories } from '@/store/slices/categorySlice';
import { EEntityTypeId, uploadImage } from '@/utils/upload';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface UpdateArtistFormProps {
  id: string;
  locale: string;
}

const UpdateArtistForm = ({ id, locale }: UpdateArtistFormProps) => {
  const { t } = useTranslation(locale);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { artist, loading, error } = useSelector((state: RootState) => state.selectedArtist);
  const { categories } = useSelector((state: RootState) => state.selectedCategory);

  const [name, setName] = useState<string>('');
  const [categoryId, setCategoryId] = useState<number>(0);
  const [bio, setBio] = useState<string>('');
  const [picture, setPicture] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (id) {
      dispatch(fetchArtist(id));
      dispatch(fetchAllCategories());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (artist) {
      setName(artist.name);
      setCategoryId(artist.category_id);
      setBio(artist.bio);
      setPicture(artist.picture);
    }
  }, [artist]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (artist) {
      let updatedArtist: Artist = {
        ...artist,
        name,
        bio,
        category_id: categoryId,
      };
      const { tracks, albums, category, ...rest } = updatedArtist;
      updatedArtist = rest;

      dispatch(updateArtist(updatedArtist))
        .unwrap()
        .then(() => {
          router.push(`/${locale}/dashboard?tab=artists`);
        });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const files = event.target.files;
    if (!files?.length) return;
    uploadImage(EEntityTypeId.artist, id, files);
    router.push(`/${locale}/dashboard?tab=artists`);
  };

  return (
    <Card className="mx-auto mt-4 w-[400px]">
      <CardHeader>
        <h2 className="text-center text-2xl font-bold">
          <Text locale={locale} text="title.form_update_artist" />
        </h2>
      </CardHeader>
      {loading ? (
        <CardContent className="text-center">
          <Text locale={locale} text="update.loading" />
        </CardContent>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                <Text locale={locale} text="tables.key.name" />
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">
                <Text locale={locale} text="tables.key.category_id" />
              </Label>
              <Select
                value={categoryId?.toString()}
                onValueChange={(value) => setCategoryId(Number(value))}
              >
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
              <Label htmlFor="bio">
                <Text locale={locale} text="tables.key.bio" />
              </Label>
              <Input id="bio" value={bio} onChange={(e) => setBio(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="picture">
                <Text locale={locale} text="tables.key.picture" />
              </Label>
              <Input
                id="picture"
                accept="image/*"
                type="file"
                onChange={(e) => handleFileChange(e, Number(id))}
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" disabled={loading} className="w-full">
              <Text locale={locale} text="update.artist" />
            </Button>
          </CardFooter>
        </form>
      )}
      {error && <p className="mt-2 text-center text-red-500">{error}</p>}
    </Card>
  );
};

export default UpdateArtistForm;
