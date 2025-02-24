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
  tab?: ViewType;
}

type ViewType = 'playlists' | 'artists' | 'albums' | 'tracks';

const TablePicker: React.FC<TablePickerProps> = ({ locale, tab = 'playlists' }) => {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage?.getItem('token')) {
      router.push(`/${locale}/login`);
    }
  }, []);

  const [view, setView] = useState<ViewType>(tab);
  const dispatch = useDispatch<AppDispatch>();

  const menuItems: { key: ViewType; text: string; style?: React.CSSProperties }[] = [
    {
      key: 'playlists',
      text: 'routes.playlist',
      style: { marginTop: '0.5rem', marginRight: '0.5rem' },
    },
    { key: 'artists', text: 'routes.artist', style: { marginRight: '0.5rem' } },
    { key: 'albums', text: 'routes.album', style: { marginRight: '0.5rem' } },
    { key: 'tracks', text: 'routes.track', style: { marginRight: '0.5rem' } },
  ];

  const handleView = (view: ViewType) => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('tag', view);
    setView(view);
    router.push(`/${locale}/dashboard?${urlParams.toString()}`);
  };

  useEffect(() => {
    dispatch(fetchAllPlaylists());
    dispatch(fetchAllArtists());
    dispatch(fetchAllAlbums());
    dispatch(fetchAllCategories());
    dispatch(fetchAllTracks());
  }, [dispatch]);

  return (
    <div className="flex w-4/5 justify-around">
      <div className="flex w-1/6 flex-col space-y-2">
        {menuItems.map(({ key, text, style }) => (
          <button
            key={key}
            onClick={() => handleView(key)}
            className="rounded-lg bg-gray-100 px-4 py-2 text-left font-medium text-gray-700 transition hover:bg-gray-200"
            style={style ? style : undefined}
          >
            <Text locale={locale} text={text} />
          </button>
        ))}
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
