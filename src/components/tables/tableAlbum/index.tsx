'use client';

import SearchBar from '@/components/searchBar';
import StreamImage from '@/components/streamImage';
import { Button } from '@/components/ui/button';
import useTranslation from '@/customHook/useTranslation';
import { AppDispatch, RootState } from '@/store'; // Assurez-vous que AppDispatch est correctement configuré
import { Album, deleteAlbum } from '@/store/slices/albumSlice';
import { ArrowDown, ArrowUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ErrorComponent from '../../error';
import Text from '../../textLocale';

interface TAlbumProps {
  locale: string;
}

const TableAlbum = ({ locale }: TAlbumProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { albums, loading, error } = useSelector((state: RootState) => state.selectedAlbum);
  const { categories } = useSelector((state: RootState) => state.selectedCategory);
  const [sortedAlbums, setSortedAlbums] = useState<Album[]>(albums || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAlbums, setFilteredAlbums] = useState<Album[]>([]);
  const { t } = useTranslation(locale);
  const [sortConfig, setSortConfig] = useState({
    key: 'title',
    direction: 'asc',
  });

  useEffect(() => {
    if (!albums) return;
    const sorted = [...albums].sort((a, b) => a.id - b.id);
    setSortedAlbums(sorted);
    setFilteredAlbums(sorted);
  }, [albums]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = sortedAlbums.filter((album) =>
      album.title.toLowerCase().includes(term.toLowerCase()),
    );
    setFilteredAlbums(filtered);
  };

  const handleSort = (key: string) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });

    const sorted = [...filteredAlbums].sort((a, b) => {
      if (key === 'title') {
        return direction === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (key === 'releaseDate') {
        return direction === 'asc'
          ? new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
          : new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      }
      return 0;
    });
    setFilteredAlbums(sorted);
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <ArrowUp className="ml-2 h-4 w-4 text-gray-400" />;
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div>
      <h1 className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
        <Text
          locale={locale}
          text="tables.albums.title"
          style="whitespace-nowrap px-6 py-2 font-medium text-gray-900 dark:text-white"
        />
      </h1>

      <div className="flex items-center justify-between bg-gray-50 px-4 py-2">
        <SearchBar placeholder={t('search.album')} onSearch={handleSearch} />
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort('title')}
            className="whitespace-nowrap"
          >
            <Text locale={locale} text="tables.key.title" />
            {getSortIcon('title')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort('releaseDate')}
            className="whitespace-nowrap"
          >
            <Text locale={locale} text="tables.key.releaseDate" />
            {getSortIcon('releaseDate')}
          </Button>
        </div>
      </div>

      {loading && (
        <div>
          <Text locale={locale} text="messages.loading" />
        </div>
      )}
      {error && <ErrorComponent message={error} locale={locale} />}
      {filteredAlbums && (
        <div className="relative overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {filteredAlbums.length > 0 &&
                  Object.keys(filteredAlbums[0]).map((key) => (
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
              {Array.isArray(filteredAlbums) && filteredAlbums.length > 0 ? (
                filteredAlbums.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <td className="px-6 py-2">{row.id}</td>
                    <td className="whitespace-nowrap px-6 py-2 font-medium text-gray-900 dark:text-white">
                      <Link href={`/${locale}/preview/album/${filteredAlbums[index].id}`}>
                        <b>{row.title}</b>
                      </Link>
                    </td>
                    <td className="px-6 py-2">{row.releaseDate.toString().split('T')[0]}</td>
                    <td className="px-6 py-2">
                      {(categories &&
                        categories!.find((category) => category.id === row.category_id)?.name) || (
                        <Text locale={locale} text="global.noCategory" />
                      )}
                    </td>
                    <td className="px-6 py-2">
                      {row.picture ? (
                        <>
                          <StreamImage size={200} imageId={row.picture} />
                        </>
                      ) : (
                        <>
                          <Text locale={locale} text="tables.albums.imageNotLoading" />
                        </>
                      )}
                    </td>
                    <td className="flex items-center gap-2 px-6 py-2">
                      <button onClick={() => dispatch(deleteAlbum(row.id))}>
                        <Text locale={locale} text="actions.delete" />
                      </button>
                      <p>|</p>
                      <Link href={`/${locale}/update/album/${row.id}`}>
                        <Text locale={locale} text="actions.edit" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 text-center">
                    <Text locale={locale} text="tables.albums.unavailable" />
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
                    href={`/${locale}/create/album`}
                  >
                    <Text
                      locale={locale}
                      text="tables.albums.create"
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

export default TableAlbum;
