'use client';

import Text from '@/components/textLocale';
import { AppDispatch, RootState } from '@/store';
import { createArtist } from '@/store/slices/artistSlice';
import { fetchAllCategories } from '@/store/slices/categorySlice';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface CreateArtistFormProps {
  locale: string;
}

const CreateArtistForm = ({ locale }: CreateArtistFormProps) => {
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
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex">
          <Text locale={locale} text="tables.key.name" />:
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
        <button type="submit" disabled={loading}>
          {loading ? (
            <Text locale={locale} text="create.loading" />
          ) : (
            <Text locale={locale} text="create.artist" />
          )}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CreateArtistForm;
