'use client';

import { AppDispatch } from '@/store';
import { fetchAllAlbums } from '@/store/slices/albumSlice';
import { fetchAllArtists } from '@/store/slices/artistSlice';
import { fetchAllCategories } from '@/store/slices/categorySlice';
import { fetchAllPlaylists } from '@/store/slices/playlistSlice';
import { fetchAllTracks } from '@/store/slices/trackSlice';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import TableAlbum from '../tables/tableAlbum';
import TableArtist from '../tables/tableArtist';
import TablePlaylist from '../tables/tablePlaylist';
import TableTrack from '../tables/tableTrack';
import Text from '../textLocale';

interface TablePickerProps {
  locale: string;
  tab?: 'playlists' | 'artists' | 'albums' | 'tracks';
}

const TablePicker: React.FC<TablePickerProps> = ({ locale, tab = 'playlists' }) => {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage?.getItem('token')) {
      router.push(`/${locale}/login`);
    }
  }, []);

  const [view, setView] = useState<'playlists' | 'artists' | 'albums' | 'tracks'>(tab);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAllPlaylists());
    dispatch(fetchAllArtists());
    dispatch(fetchAllAlbums());
    dispatch(fetchAllCategories());
    dispatch(fetchAllTracks());
  }, [dispatch]);

  return (
    <div className="flex w-4/5 justify-around">
      <div className="flex w-1/6 flex-col">
        <button className="mr-2" onClick={() => setView('playlists')}>
          <Text locale={locale} text="routes.playlist" style="text-left" />
        </button>
        <button className="mr-2" onClick={() => setView('artists')}>
          <Text locale={locale} text="routes.artist" style="text-left" />
        </button>
        <button onClick={() => setView('albums')}>
          <Text locale={locale} text="routes.album" style="text-left" />
        </button>
        <button onClick={() => setView('tracks')}>
          <Text locale={locale} text="routes.track" style="text-left" />
        </button>
      </div>
      <div className="flex-3 w-5/6">
        {view === 'playlists' && <TablePlaylist locale={locale} />}
        {view === 'artists' && <TableArtist locale={locale} />}
        {view === 'albums' && <TableAlbum locale={locale} />}
        {view === 'tracks' && <TableTrack locale={locale} />}
      </div>
    </div>
  );
};

export default TablePicker;
