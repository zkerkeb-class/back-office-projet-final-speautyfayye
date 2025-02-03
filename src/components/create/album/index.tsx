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
  const [picture, setPicture] = useState<string | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && releaseDate && categoryId !== null) {
      dispatch(
        createAlbum({
          title,
          releaseDate: new Date(releaseDate),
          category_id: categoryId,
          picture,
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
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex">
          <Text locale={locale} text="tables.key.title" />:
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="flex">
          <Text locale={locale} text="tables.key.releaseDate" />:
          <input
            type="date"
            id="releaseDate"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            required
          />
        </div>
        <div className="flex">
          <Text locale={locale} text="tables.key.category_id" />:
          <select
            id="categoryId"
            value={categoryId ?? ''}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            required
          >
            <option value="" disabled>
              {t('select.category')}
            </option>
            {categories &&
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className="flex">
          <Text locale={locale} text="tables.key.picture" />:
          <input
            type="text"
            id="picture"
            value={picture}
            onChange={(e) => setPicture(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? (
            <Text locale={locale} text="create.loading" />
          ) : (
            <Text locale={locale} text="create.album" />
          )}
        </button>
      </form>
      {error && <ErrorComponent message={error} />}
    </div>
  );
};

export default CreateAlbumForm;
