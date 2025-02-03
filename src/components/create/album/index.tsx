'use client';

import ErrorComponent from '@/components/error';
import Text from '@/components/textLocale';
import useTranslation from '@/customHook/useTranslation';
import { AppDispatch, RootState } from '@/store';
import { createAlbum } from '@/store/slices/albumSlice';
import { fetchAllCategories } from '@/store/slices/categorySlice';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateAlbumFormProps {
  locale: string;
}

const CreateAlbumForm = ({ locale }: CreateAlbumFormProps) => {
  const { t } = useTranslation(locale);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.selectedAlbum);
  const { categories } = useSelector((state: RootState) => state.selectedCategory);

  const [title, setTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && releaseDate && categoryId !== null) {
      dispatch(
        createAlbum({
          title,
          releaseDate: new Date(releaseDate),
          category_id: categoryId
        }),
      )
        .unwrap()
        .then(() => {
          console.info('Album created successfully');
          router.push(`/${locale}/dashboard?tab=albums`);
        })
        .catch((err) => {
          console.error('Failed to create album:', err);
        });
    }
  };

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, []);

  return (
    <Card className="w-[400px] mx-auto mt-10">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">
          <Text locale={locale} text="title.form_create_album" />
        </h2>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              <Text locale={locale} text="tables.key.title" />
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="releaseDate">
              <Text locale={locale} text="tables.key.releaseDate" />
            </Label>
            <Input
              type="date"
              id="releaseDate"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              required
            />
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

          {/* <div className="space-y-2">
            <Label htmlFor="picture">
              <Text locale={locale} text="tables.key.picture" />
            </Label>
            <Input
              id="picture"
              value={picture}
              onChange={(e) => setPicture(e.target.value)}
            />
          </div> */}
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <Text locale={locale} text="create.loading" />
            ) : (
              <Text locale={locale} text="create.album" />

            )}
          </Button>
        </CardFooter>
      </form>
      {error && <ErrorComponent message={error} />}
    </Card>
  );
};

export default CreateAlbumForm;
