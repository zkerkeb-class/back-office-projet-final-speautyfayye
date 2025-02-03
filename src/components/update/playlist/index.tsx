'use client';

import ErrorComponent from '@/components/error';
import Text from '@/components/textLocale';
import { AppDispatch, RootState } from '@/store';
import { fetchPlaylist, Playlist, updatePlaylist } from '@/store/slices/playlistSlice';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface UpdatePlaylistFormProps {
  id: string;
  locale: string;
}

const UpdatePlaylistForm = ({ id, locale }: UpdatePlaylistFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { playlist, loading, error } = useSelector((state: RootState) => state.selectedPlaylist);

  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    if (id) {
      dispatch(fetchPlaylist(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (playlist) {
      setTitle(playlist.title);
    }
  }, [playlist]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playlist) {
      const updatedPlaylist: Playlist = {
        ...playlist,
        title,
      };
      dispatch(updatePlaylist(updatedPlaylist))
        .unwrap()
        .then(() => {
          router.push(`/${locale}/dashboard?tab=playlists`);
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
          <Text locale={locale} text="tables.key.title" /> :
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <button type="submit">
          <Text locale={locale} text="update.playlist" />
        </button>
      </form>
    </div>
  );
};

export default UpdatePlaylistForm;
