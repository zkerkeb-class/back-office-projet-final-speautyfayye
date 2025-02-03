'use client';

import ErrorComponent from '@/components/error';
import Text from '@/components/textLocale';
import useTranslation from '@/customHook/useTranslation';
import { AppDispatch, RootState } from '@/store';
import { Artist, fetchArtist, updateArtist } from '@/store/slices/artistSlice';
import { fetchAllCategories } from '@/store/slices/categorySlice';
import { EEntityTypeId, upload } from '@/utils/upload';
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
    upload(EEntityTypeId.artist, id, files);
    router.push(`/${locale}/dashboard?tab=artists`);
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
          <Text locale={locale} text="tables.key.name" /> :
          <input type="text" id="title" value={name} onChange={(e) => setName(e.target.value)} />
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
          <Text locale={locale} text="tables.key.bio" />:
          <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} required />
        </div>
        <div className="flex">
          <Text locale={locale} text="tables.key.picture" />:
          <input type="file" onChange={(e) => handleFileChange(e, Number(id))} />
        </div>
        <button type="submit">
          <Text locale={locale} text="update.playlist" />
        </button>
      </form>
    </div>
  );
};

export default UpdateArtistForm;
