'use client';

import StreamImage from '@/components/streamImage';
import { AppDispatch, RootState } from '@/store'; // Assurez-vous que AppDispatch est correctement configuré
import { deleteTrack } from '@/store/slices/trackSlice';
import Link from 'next/link';
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

  return (
    <div>
      <h1 className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
        <Text
          locale={locale}
          text="tables.tracks.title"
          style="whitespace-nowrap px-6 py-2 font-medium text-gray-900 dark:text-white"
        />
      </h1>
      {loading && (
        <div>
          <Text locale={locale} text="messages.loading" />
        </div>
      )}
      {error && <ErrorComponent message={error} />}
      {tracks && (
        <div className="relative overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {tracks.length > 0 &&
                  Object.keys(tracks[0]).map((key) => (
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
              {Array.isArray(tracks) && tracks.length > 0
                ? tracks.map((row, index) => (
                    <tr
                      key={index}
                      className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <td className="px-6 py-2">{row.id}</td>
                      <td className="whitespace-nowrap px-6 py-2 font-medium text-gray-900 dark:text-white">
                        {row.title}
                      </td>
                      <td className="px-6 py-2">{row.duration && Math.floor(row.duration)}</td>
                      <td className="px-6 py-2">
                        {row.releaseDate && row.releaseDate.toString().split('T')[0]}
                      </td>
                      <td className="px-6 py-2">{row.trackNumber.toString()}</td>
                      <td className="px-6 py-2">{row.number_of_plays.toString()}</td>
                      <td className="px-6 py-2">{row.lyrics?.substring(0, 50)}</td>
                      <td className="px-6 py-2">{row.album_id}</td>
                      <td className="px-6 py-2">
                        {(categories &&
                          categories!.find((category) => category.id === row.category_id)
                            ?.name) || <Text locale={locale} text="tables.tracks.noCategory" />}
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
                : tracks.length == 0 && (
                    <tr>
                      <td colSpan={12}>
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
