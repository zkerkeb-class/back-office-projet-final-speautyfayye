'use client';

import StreamImage from '@/components/streamImage';
import { AppDispatch, RootState } from '@/store'; // Assurez-vous que AppDispatch est correctement configuré
import { deleteAlbum } from '@/store/slices/albumSlice';
import { EEntityTypeId, upload } from '@/utils/upload';
import Link from 'next/link';
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const files = event.target.files;
    if (!files?.length) return;
    upload(EEntityTypeId.album, id, files);
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
      {loading && (
        <div>
          <Text locale={locale} text="messages.loading" />
        </div>
      )}
      {error && <ErrorComponent message={error} />}
      {albums && (
        <div className="relative overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {albums.length > 0 &&
                  Object.keys(albums[0]).map((key) => (
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
              {Array.isArray(albums) && albums.length > 0
                ? albums.map((row, index) => (
                    <tr
                      key={index}
                      className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <td className="px-6 py-2">{row.id}</td>
                      <td className="whitespace-nowrap px-6 py-2 font-medium text-gray-900 dark:text-white">
                        {row.title}
                      </td>
                      <td className="px-6 py-2">{row.releaseDate.toString()}</td>
                      <td className="px-6 py-2">
                        {(categories &&
                          categories!.find((category) => category.id === row.category_id)
                            ?.name) || <Text locale={locale} text="tables.artists.noCategory" />}
                      </td>
                      {/* <td className="px-6 py-2">{row.picture}</td> */}
                      <td className="px-6 py-2">
                        {row.picture ? (
                          <>
                            <StreamImage size={200} imageId={row.picture} />
                            <input type="file" onChange={(e) => handleFileChange(e, row.id)} />
                          </>
                        ) : (
                          <>
                            <Text locale={locale} text="tables.albums.noImage" />
                            <input type="file" onChange={(e) => handleFileChange(e, row.id)} />
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
                : albums.length == 0 && (
                    <tr>
                      <td colSpan={6}>
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
