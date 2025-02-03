'use client';

import Text from '@/components/textLocale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import { Album, fetchAlbum, updateAlbum } from '@/store/slices/albumSlice';
import { fetchAllCategories } from '@/store/slices/categorySlice';
import { EEntityTypeId, uploadImage } from '@/utils/upload';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface UpdateAlbumFormProps {
  id: string;
  locale: string;
}

const UpdateAlbumForm = ({ id, locale }: UpdateAlbumFormProps) => {
  const { t } = useTranslation(locale);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { album, loading, error } = useSelector((state: RootState) => state.selectedAlbum);
  const { categories } = useSelector((state: RootState) => state.selectedCategory);

  const [title, setTitle] = useState<string>('');
  const [categoryId, setCategoryId] = useState<number>(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchAlbum(id));
      dispatch(fetchAllCategories());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (album) {
      setTitle(album.title);
      setCategoryId(album.category_id);
    }
  }, [album]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (album) {
      let updatedAlbum: Album = {
        ...album,
        title,
        category_id: categoryId,
      };

      const { artist, tracks, ...rest } = updatedAlbum;
      updatedAlbum = rest;
      dispatch(updateAlbum(updatedAlbum))
        .unwrap()
        .then(() => {
          router.push(`/${locale}/dashboard?tab=albums`);
        });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const files = event.target.files;
    if (!files?.length) return;
    uploadImage(EEntityTypeId.album, id, files);
    router.push(`/${locale}/dashboard?tab=albums`);
  };

  return (
    <Card className="mx-auto mt-10 w-[400px]">
      <CardHeader>
        <h2 className="text-center text-2xl font-bold">
          <Text locale={locale} text="title.form_update_album" />
        </h2>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              <Text locale={locale} text="tables.key.title" />
            </Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
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
            <Label htmlFor="picture">
              <Text locale={locale} text="tables.key.picture" />
            </Label>
            <Input type="file" onChange={(e) => handleFileChange(e, Number(id))} />
          </div>
          <Button type="submit">
            <Text locale={locale} text="update.album" />
          </Button>
        </CardContent>
      </form>
    </Card>
  );
};

export default UpdateAlbumForm;
