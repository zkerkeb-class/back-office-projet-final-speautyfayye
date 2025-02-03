'use client';

import ErrorComponent from '@/components/error';
import Text from '@/components/textLocale';
import useTranslation from '@/customHook/useTranslation';
import { AppDispatch, RootState } from '@/store';
import { Album, fetchAlbum, updateAlbum } from '@/store/slices/albumSlice';
import { fetchAllCategories } from '@/store/slices/categorySlice';
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

  return (
    <div>
      {loading && (
        <div>
          <Text locale={locale} text="update.loading" />
        </div>
      )}{' '}
      {error && <ErrorComponent message={error} />}
      <form onSubmit={handleSubmit}>
        <div className="flex">
          <Text locale={locale} text="tables.key.title" />
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="flex">
          <Text locale={locale} text="tables.key.category_id" />:
          <select
            id="categoryId"
            value={categoryId ?? ''}
            onChange={(e) => {
              console.log(e.target.value);

              setCategoryId(Number(e.target.value));
            }}
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
          <Text locale={locale} text="tables.key.picture" />
          <input type="file" />
        </div>
        <button type="submit">
          <Text locale={locale} text="update.album" />
        </button>
      </form>
    </div>
  );
};

export default UpdateAlbumForm;
