'use client';

import { AppDispatch, RootState } from '@/store'; // Assurez-vous que AppDispatch est correctement configuré
import { deleteAlbum } from '@/store/slices/albumSlice';
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
                      <td className="px-6 py-2">{row.category_id}</td>
                      {/* <td className="px-6 py-2">{row.picture}</td> */}
                      <td className="px-6 py-2">
                        {row.picture ? (
                          // TODO: A tester quand une image est disponible
                          <div>
                            <button
                              onClick={() => {
                                const modal = document.createElement('div');
                                modal.style.position = 'fixed';
                                modal.style.top = '0';
                                modal.style.left = '0';
                                modal.style.width = '100%';
                                modal.style.height = '100%';
                                modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                                modal.style.display = 'flex';
                                modal.style.justifyContent = 'center';
                                modal.style.alignItems = 'center';
                                modal.style.zIndex = '1000';

                                const img = document.createElement('img');
                                img.src = row.picture!;
                                img.alt = row.title;
                                img.style.maxWidth = '90%';
                                img.style.maxHeight = '90%';

                                modal.appendChild(img);
                                modal.addEventListener('click', () => {
                                  document.body.removeChild(modal);
                                });

                                document.body.appendChild(modal);
                              }}
                            ></button>
                          </div>
                        ) : (
                          <Text locale={locale} text="tables.albums.noImage" />
                        )}
                      </td>
                      <td className="flex items-center gap-2 px-6 py-2">
                        <button onClick={() => dispatch(deleteAlbum(row.id))}>
                          <Text locale={locale} text="actions.delete" />
                        </button>
                        <p>|</p>
                        <button onClick={() => console.log('update')}>
                          <Text locale={locale} text="actions.edit" />
                        </button>
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
