'use client';

import ErrorComponent from '@/components/error';
import Text from '@/components/textLocale';
import { AppDispatch, RootState } from '@/store';
import { Artist, fetchArtist, updateArtist } from '@/store/slices/artistSlice';
import { fetchAllCategories } from '@/store/slices/categorySlice';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface UpdateArtistFormProps {
  id: string;
  locale: string;
}

const UpdateArtistForm = ({ id, locale }: UpdateArtistFormProps) => {
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
        picture,
        category_id: categoryId,
      };
      // const { artist: artisted, tracks, ...rest } = updatedArtist;
      const { tracks, ...rest } = updatedArtist;
      updatedArtist = rest;
      console.log(updatedArtist);

      dispatch(updateArtist(updatedArtist))
        .unwrap()
        .then(() => {
          router.push(`/${locale}/dashboard?tab=artists`);
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
              <Text locale={locale} text="select.category" />
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
          <input
            type="text"
            id="picture"
            value={picture}
            onChange={(e) => setPicture(e.target.value)}
          />
        </div>
        <button type="submit">
          <Text locale={locale} text="update.playlist" />
        </button>
      </form>
    </div>
  );
};

export default UpdateArtistForm;
