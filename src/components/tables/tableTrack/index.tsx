'use client';

import SearchBar from '@/components/searchBar';
import StreamImage from '@/components/streamImage';
import { Button } from '@/components/ui/button';
import useTranslation from '@/customHook/useTranslation';
import { AppDispatch, RootState } from '@/store'; // Assurez-vous que AppDispatch est correctement configuré
import { deleteTrack, Track } from '@/store/slices/trackSlice';
import { formatDuration } from '@/utils/helpers';
import { ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ErrorComponent from '../../error';
import Text from '../../textLocale';

interface TAlbumProps {
  locale: string;
}

const TableTrack = ({ locale }: TAlbumProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { tracks, loading, error } = useSelector((state: RootState) => state.selectedTrack);
  const { categories } = useSelector((state: RootState) => state.selectedCategory);
  const [sortedTracks, setSortedTracks] = useState<Track[]>(tracks || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  const { t } = useTranslation(locale);
  const [sortConfig, setSortConfig] = useState({
    key: 'title',
    direction: 'asc',
  });

  useEffect(() => {
    if (!tracks) return;
    const sorted = [...tracks].sort((a, b) => a.id - b.id);
    setSortedTracks(sorted);
    setFilteredTracks(sorted);
  }, [tracks]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = sortedTracks.filter((track) =>
      track.title.toLowerCase().includes(term.toLowerCase()),
    );
    setFilteredTracks(filtered);
  };

  const handleSort = (key: string) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });

    const sorted = [...filteredTracks].sort((a, b) => {
      switch (key) {
        case 'title':
          return direction === 'asc'
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        case 'duration':
          return direction === 'asc'
            ? (a.duration || 0) - (b.duration || 0)
            : (b.duration || 0) - (a.duration || 0);
        case 'releaseDate':
          return direction === 'asc'
            ? new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
            : new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        case 'popularity':
          return direction === 'asc'
            ? a.number_of_plays - b.number_of_plays
            : b.number_of_plays - a.number_of_plays;
        default:
          return 0;
      }
    });
    setFilteredTracks(sorted);
  };

  return (
    <div>
      <h1 className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
        <Text
          locale={locale}
          text="tables.tracks.title"
          style="whitespace-nowrap px-6 py-2 font-medium text-gray-900 dark:text-white"
        />
      </h1>

      <div className="flex items-center justify-between bg-gray-50 px-4 py-2">
        <SearchBar placeholder={t('search.track')} onSearch={handleSearch} />
        <div className="ml-4 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort('title')}
            className="whitespace-nowrap"
          >
            <Text locale={locale} text="tables.key.title" />
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort('duration')}
            className="whitespace-nowrap"
          >
            <Text locale={locale} text="tables.key.duration" />
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort('releaseDate')}
            className="whitespace-nowrap"
          >
            <Text locale={locale} text="tables.key.releaseDate" />
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort('popularity')}
            className="whitespace-nowrap"
          >
            <Text locale={locale} text="tables.key.number_of_plays" />
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading && (
        <div>
          <Text locale={locale} text="messages.loading" />
        </div>
      )}
      {error && <ErrorComponent message={error} locale={locale} />}
      {filteredTracks && (
        <div className="relative overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {filteredTracks.length > 0 &&
                  Object.keys(filteredTracks[0]).map((key) => (
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
              {Array.isArray(filteredTracks) && filteredTracks.length > 0 ? (
                filteredTracks.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <td className="px-6 py-2">{row.id}</td>
                    <td className="whitespace-nowrap px-6 py-2 font-medium text-gray-900 dark:text-white">
                      {row.title}
                    </td>
                    <td className="px-6 py-2">
                      {row.duration && formatDuration(row.duration.toString())}
                    </td>
                    <td className="px-6 py-2">
                      {row.releaseDate && row.releaseDate.toString().split('T')[0]}
                    </td>
                    <td className="px-6 py-2">{row.trackNumber.toString()}</td>
                    <td className="px-6 py-2">{row.number_of_plays.toString()}</td>
                    <td className="px-6 py-2">{row.lyrics?.substring(0, 50)}</td>
                    <td className="px-6 py-2">{row.album_id}</td>
                    <td className="px-6 py-2">
                      {(categories &&
                        categories!.find((category) => category.id === row.category_id)?.name) || (
                        <Text locale={locale} text="tables.tracks.noCategory" />
                      )}
                    </td>
                    <td className="px-6 py-2">
                      {row.picture ? (
                        <>
                          <StreamImage size={200} imageId={row.picture} />
                        </>
                      ) : (
                        <>
                          <Text locale={locale} text="tables.tracks.noImage" />
                        </>
                      )}
                    </td>
                    <td className="px-6 py-2">{row.audio}</td>

                    <td className="flex items-center gap-2 px-6 py-2">
                      <button onClick={() => dispatch(deleteTrack(row.id))}>
                        <Text locale={locale} text="actions.delete" />
                      </button>
                      <p>|</p>
                      <Link href={`/${locale}/update/track/${row.id}`}>
                        <Text locale={locale} text="actions.edit" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={12} className="py-4 text-center">
                    <Text locale={locale} text="tables.tracks.unavailable" />
                  </td>
                </tr>
              )}
              <tr>
                <td
                  colSpan={12}
                  className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
                >
                  <Link
                    className="font-medium text-gray-800 no-underline"
                    href={`/${locale}/create/track`}
                  >
                    <Text
                      locale={locale}
                      text="tables.tracks.create"
                      style="whitespace-nowrap px-6 py-2 font-medium text-gray-900 dark:text-white"
                    />
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="w-full bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"></div>
        </div>
      )}
    </div>
  );
};

export default TableTrack;
