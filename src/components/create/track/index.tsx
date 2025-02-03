'use client';

import Text from '@/components/textLocale';
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
      URL.revokeObjectURL(objectURL); // Nettoyer l'URL temporaire
    };
  };

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, []);

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input type="file" onChange={(e) => handleFileChange(e)} accept=".mp3" required />
        <div className="flex">
          <h1>Titre</h1>
          <input type="text" name="title" required />
        </div>
        <div className="flex">
          <Text locale={locale} text="tables.key.releaseDate" />:
          <input type="date" name="releaseDate" required />
        </div>
        <div className="flex">
          <Text locale={locale} text="tables.key.category_id" />:
          <select name="category_id" required>
            <option disabled>{t('select.category')}</option>
            {categories &&
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className="flex">
          <h1>Album ID</h1>
          <input type="number" name="album_id" />
        </div>
        <div className="flex">
          <h1>Lyrics</h1>
          <textarea name="lyrics" />
        </div>
        <input type="hidden" name="audio" value="1ff1fc8e-81d1-4c67-8109-7313587382c5" />
        <button type="submit">Créer</button>
      </form>
    </div>
  );
};

export default TrackForm;
