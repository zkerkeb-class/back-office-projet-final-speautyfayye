'use client';

import Text from '@/components/textLocale';
import useTranslation from '@/customHook/useTranslation';
import { AppDispatch, RootState } from '@/store';
import { createArtist } from '@/store/slices/artistSlice';
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


interface CreateArtistFormProps {
  locale: string;
}

const CreateArtistForm = ({ locale }: CreateArtistFormProps) => {
  const { t } = useTranslation(locale);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  //   const { loading, error } = useSelector((state: RootState) => state.selectedArtist);
  const { loading, error } = useSelector((state: RootState) => state.selectedArtist);
  const { categories } = useSelector((state: RootState) => state.selectedCategory);

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [bio, setBio] = useState('');
  const [picture, setPicture] = useState<string | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && categoryId !== null && bio) {
      dispatch(createArtist({ name, category_id: categoryId, bio, picture }))
        .unwrap()
        .then(() => {
          console.info('Artist created successfully');
          router.push(`/${locale}/dashboard?tab=artists`);
        })
        .catch((err) => {
          console.error('Failed to create artist:', err);
        });
    }
  };

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  return (
    <Card className="w-[400px] mx-auto mt-10">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">
          <Text locale={locale} text="title.form_create_artist" />
        </h2>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              <Text locale={locale} text="tables.key.name" />
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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

          <div className="space-y-2">
            <Label htmlFor="bio">
              <Text locale={locale} text="tables.key.bio" />
            </Label>
            <Input
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="picture">
              <Text locale={locale} text="tables.key.picture" />
            </Label>
            <Input
              id="picture"
              value={picture}
              onChange={(e) => setPicture(e.target.value)}
            />
          </div>
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
              <Text locale={locale} text="create.artist" />
            )}
          </Button>
        </CardFooter>
      </form>
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
    </Card>
  );
};

export default CreateArtistForm;
