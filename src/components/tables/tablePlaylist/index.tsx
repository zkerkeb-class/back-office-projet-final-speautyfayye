'use client';

import { AppDispatch, RootState } from '@/store'; // Assurez-vous que AppDispatch est correctement configuré
import { deletePlaylist } from '@/store/slices/playlistSlice';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import ErrorComponent from '../../error';
import Text from '../../textLocale';

interface TPlaylistProps {
  locale: string;
}

const TablePlaylist = ({ locale }: TPlaylistProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { playlists, loading, error } = useSelector((state: RootState) => state.selectedPlaylist);

  return (
    <div>
      <h1 className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
        <Text
          locale={locale}
          text="tables.playlists.title"
          style="whitespace-nowrap px-6 py-2 font-medium text-gray-900 dark:text-white"
        />
      </h1>
      {loading && (
        <div>
          <Text locale={locale} text="messages.loading" />
        </div>
      )}
      {error && <ErrorComponent message={error} />}
      {playlists && (
        <div className="relative overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {playlists.length > 0 &&
                  Object.keys(playlists[0]).map((key) => (
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
              {Array.isArray(playlists) && playlists.length > 0
                ? playlists.map((row, index) => (
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
                        <button onClick={() => console.log('update')}>
                          <Text locale={locale} text="actions.edit" />
                        </button>
                      </td>
                    </tr>
                  ))
                : playlists.length == 0 && (
                    <tr>
                      <td colSpan={4}>
                        <Text locale={locale} text="tables.playlists.unavailable" />
                      </td>
                    </tr>
                  )}
              <tr>
                <td
                  colSpan={4}
                  className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
                >
                  <Link
                    className="font-medium text-gray-800 no-underline"
                    href={`/${locale}/create/playlist`}
                  >
                    <Text
                      locale={locale}
                      text="tables.playlists.create"
                      style="whitespace-nowrap px-6 py-2 font-medium text-gray-900 dark:text-white "
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

export default TablePlaylist;
