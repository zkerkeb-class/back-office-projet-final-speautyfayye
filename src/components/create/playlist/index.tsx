'use client';

import ErrorComponent from '@/components/error';
import Text from '@/components/textLocale';
import { AppDispatch, RootState } from '@/store';
import { createPlaylist } from '@/store/slices/playlistSlice';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface createPlaylistFormProps {
  locale: string;
}

const CreatePlaylistForm = ({ locale }: createPlaylistFormProps) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.selectedPlaylist);

  const [title, setTitle] = useState('');
  const [userId, setUserId] = useState<number | null>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && userId !== null) {
      dispatch(createPlaylist({ title, user_id: userId }))
        .unwrap()
        .then(() => {
          router.push(`/${locale}/dashboard?tab=playlists`);
        });
    }
  };

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
          <Text locale={locale} text="tables.key.user_id" />:
          <input
            type="number"
            id="userId"
            value={userId !== null ? userId : ''}
            onChange={(e) => setUserId(Number(e.target.value))}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? (
            <Text locale={locale} text="create.loading" />
          ) : (
            <Text locale={locale} text="create.playlist" />
          )}
        </button>
      </form>
      {error && <ErrorComponent message={error} locale={locale} />}
    </div>
  );
};

export default CreatePlaylistForm;
