'use client';

import SearchBar from '@/components/searchBar';
import { Button } from '@/components/ui/button';
import useTranslation from '@/customHook/useTranslation';
import { AppDispatch, RootState } from '@/store'; // Assurez-vous que AppDispatch est correctement configuré
import { deletePlaylist, Playlist } from '@/store/slices/playlistSlice';
import { ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ErrorComponent from '../../error';
import Text from '../../textLocale';

interface TPlaylistProps {
  locale: string;
}

const TablePlaylist = ({ locale }: TPlaylistProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { playlists, loading, error } = useSelector((state: RootState) => state.selectedPlaylist);
  const [sortedPlaylists, setSortedPlaylists] = useState<Playlist[]>(playlists || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPlaylists, setFilteredPlaylists] = useState<Playlist[]>([]);
  const { t } = useTranslation(locale);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    if (!playlists) return;
    const sorted = [...playlists].sort((a, b) => a.id - b.id);
    setSortedPlaylists(sorted);
    setFilteredPlaylists(sorted);
  }, [playlists]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = sortedPlaylists.filter((playlist) =>
      playlist.title.toLowerCase().includes(term.toLowerCase()),
    );
    setFilteredPlaylists(filtered);
  };

  const handleSortByTitle = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    const sorted = [...filteredPlaylists].sort((a, b) => {
      return sortDirection === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    });
    setFilteredPlaylists(sorted);
  };

  return (
    <div>
      <h1 className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
        <Text
          locale={locale}
          text="tables.playlists.title"
          style="whitespace-nowrap px-6 py-2 font-medium text-gray-900 dark:text-white"
        />
      </h1>

      <div className="flex items-center justify-between bg-gray-50 px-4 py-2">
        <SearchBar placeholder={t('search.playlist')} onSearch={handleSearch} />
        <Button
          variant="outline"
          size="sm"
          onClick={handleSortByTitle}
          className="ml-4 whitespace-nowrap"
        >
          <Text locale={locale} text="tables.key.title" />
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {loading && (
        <div>
          <Text locale={locale} text="messages.loading" />
        </div>
      )}
      {error && <ErrorComponent message={error} locale={locale} />}

      {filteredPlaylists && (
        <div className="relative overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {sortedPlaylists.length > 0 &&
                  Object.keys(sortedPlaylists[0]).map((key) => (
                    <th key={key} className="px-6 py-3">
                      <Text locale={locale} text={`tables.key.${key}`} />
                    </th>
                  ))}
                <th className="px-6 py-3">
                  <Text locale={locale} text={`tables.key.action`} />
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredPlaylists) && filteredPlaylists.length > 0 ? (
                filteredPlaylists.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <td className="px-6 py-2">{row.id}</td>
                    <td className="whitespace-nowrap px-6 py-2 font-medium text-gray-900 dark:text-white">
                      {row.title}
                    </td>
                    <td className="px-6 py-2">{row.user_id}</td>
                    <td className="flex items-center gap-2 px-6 py-2">
                      <button onClick={() => dispatch(deletePlaylist(row.id))}>
                        <Text locale={locale} text="actions.delete" />
                      </button>
                      <p>|</p>
                      <Link href={`/${locale}/update/playlist/${row.id}`}>
                        <Text locale={locale} text="actions.edit" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center">
                    <Text locale={locale} text="tables.playlists.unavailable" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="w-full bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"></div>
        </div>
      )}
    </div>
  );
};

export default TablePlaylist;
