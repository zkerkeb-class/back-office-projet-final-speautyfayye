'use client';

import SearchBar from '@/components/searchBar';
import StreamImage from '@/components/streamImage';
import { Button } from '@/components/ui/button';
import useTranslation from '@/customHook/useTranslation';
import { AppDispatch, RootState } from '@/store'; // Assurez-vous que AppDispatch est correctement configuré
import { Artist, deleteArtist } from '@/store/slices/artistSlice';
import { ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ErrorComponent from '../../error';
import Text from '../../textLocale';

interface TArtistProps {
  locale: string;
}

const TableArtist = ({ locale }: TArtistProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { artists, loading, error } = useSelector((state: RootState) => state.selectedArtist);
  const { categories } = useSelector((state: RootState) => state.selectedCategory);
  const [sortedArtists, setSortedArtists] = useState<Artist[]>(artists || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { t } = useTranslation(locale);

  useEffect(() => {
    if (!artists) return;
    const sorted = [...artists].sort((a, b) => a.id - b.id);
    setSortedArtists(sorted);
    setFilteredArtists(sorted);
  }, [artists]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = sortedArtists.filter((artist) =>
      artist.name.toLowerCase().includes(term.toLowerCase()),
    );
    setFilteredArtists(filtered);
  };

  const handleSortByName = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    const sorted = [...filteredArtists].sort((a, b) => {
      return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    });
    setFilteredArtists(sorted);
  };

  return (
    <div>
      <h1 className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
        <Text
          locale={locale}
          text="tables.artists.title"
          style="whitespace-nowrap px-6 py-2 font-medium text-gray-900 dark:text-white"
        />
      </h1>

      <div className="flex items-center justify-between bg-gray-50 px-4 py-2">
        <SearchBar placeholder={t('search.artist')} onSearch={handleSearch} />
        <Button
          variant="outline"
          size="sm"
          onClick={handleSortByName}
          className="ml-4 whitespace-nowrap"
        >
          <Text locale={locale} text="tables.key.name" />
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {loading && (
        <div>
          <Text locale={locale} text="messages.loading" />
        </div>
      )}
      {error && <ErrorComponent message={error} locale={locale} />}
      {filteredArtists && (
        <div>
          <div className="relative overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  {filteredArtists.length > 0 &&
                    Object.keys(filteredArtists[0]).map((colKey) => (
                      <th key={colKey} className="px-6 py-3">
                        <Text locale={locale} text={`tables.key.${colKey}`} />
                      </th>
                    ))}
                  <th className="px-6 py-3">
                    <Text locale={locale} text={`tables.key.action`} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(filteredArtists) && filteredArtists.length > 0 ? (
                  filteredArtists.map((artist, index) => (
                    <tr
                      key={index}
                      className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <td className="px-6 py-2">{artist.id}</td>
                      <td className="whitespace-nowrap px-6 py-2 font-medium text-gray-900 dark:text-white">
                        <Link href={`/${locale}/preview/artist/${filteredArtists[0].id}`}>
                          <b>{artist.name}</b>
                        </Link>
                      </td>
                      <td className="px-6 py-2">
                        {(categories &&
                          categories!.find((category) => category.id === artist.category_id)
                            ?.name) || <Text locale={locale} text="global.noCategory" />}
                      </td>
                      <td className="px-6 py-2">{artist.bio && artist.bio.substring(0, 50)}</td>
                      <td>
                        {artist.picture ? (
                          <>
                            <StreamImage size={200} imageId={artist.picture} />
                            {/* <input type="file" onChange={(e) => handleFileChange(e, row.id)} /> */}
                          </>
                        ) : (
                          <>
                            <Text locale={locale} text="tables.albums.noImage" />
                            {/* <input type="file" onChange={(e) => handleFileChange(e, row.id)} /> */}
                          </>
                        )}
                      </td>
                      <td className="flex items-center gap-2 px-6 py-2">
                        <button onClick={() => dispatch(deleteArtist(artist.id))}>
                          <Text locale={locale} text="actions.delete" />
                        </button>
                        <p>|</p>
                        <Link href={`/${locale}/update/artist/${artist.id}`}>
                          <Text locale={locale} text="actions.edit" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 text-center">
                      <Text locale={locale} text="tables.artists.unavailable" />
                    </td>
                  </tr>
                )}
                <tr>
                  <td
                    colSpan={6}
                    className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
                  >
                    <Link
                      className="font-medium text-gray-800 no-underline"
                      href={`/${locale}/create/artist`}
                    >
                      <Text
                        locale={locale}
                        text="tables.artists.create"
                        style="whitespace-nowrap px-6 py-2 font-medium text-gray-900 dark:text-white "
                      />
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="w-full bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableArtist;
