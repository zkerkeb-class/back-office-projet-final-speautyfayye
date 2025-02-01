'use client';

import { AppDispatch } from '@/store';
import { fetchAllAlbums } from '@/store/slices/albumSlice';
import { fetchAllArtists } from '@/store/slices/artistSlice';
import { fetchAllPlaylists } from '@/store/slices/playlistSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import TableAlbum from '../tables/tableAlbum';
import TableArtist from '../tables/tableArtist';
import TablePlaylist from '../tables/tablePlaylist';
import Text from '../textLocale';

interface TablePickerProps {
  locale: string;
  tab?: 'playlists' | 'artists' | 'albums';
}

const TablePicker: React.FC<TablePickerProps> = ({ locale, tab = 'albums' }) => {
  console.log('🚀 ~ tab:', tab);
  const [view, setView] = useState<'playlists' | 'artists' | 'albums'>(tab);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAllPlaylists());
    dispatch(fetchAllArtists());
    dispatch(fetchAllAlbums());
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
      </div>
      <div className="flex-3 w-5/6">
        {view === 'playlists' && <TablePlaylist locale={locale} />}
        {view === 'artists' && <TableArtist locale={locale} />}
        {view === 'albums' && <TableAlbum locale={locale} />}
      </div>
    </div>
  );
};

export default TablePicker;
