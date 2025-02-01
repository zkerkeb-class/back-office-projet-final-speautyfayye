'use client';

import { AppDispatch, RootState } from '@/store'; // Assurez-vous que AppDispatch est correctement configuré
import { deleteArtist } from '@/store/slices/artistSlice';
import Link from 'next/link';
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

  return (
    <div>
      <h1 className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
        <Text
          locale={locale}
          text="tables.artists.title"
          style="whitespace-nowrap px-6 py-2 font-medium text-gray-900 dark:text-white"
        />
      </h1>
      {loading && (
        <div>
          <Text locale={locale} text="messages.loading" />
        </div>
      )}
      {error && <ErrorComponent message={error} />}
      {artists && (
        <div>
          <div className="relative overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  {artists.length > 0 &&
                    Object.keys(artists[0]).map((key) => (
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
                {Array.isArray(artists) && artists.length > 0
                  ? artists.map((row, index) => (
                      <tr
                        key={index}
                        className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                      >
                        <td className="px-6 py-2">{row.id}</td>
                        <td className="whitespace-nowrap px-6 py-2 font-medium text-gray-900 dark:text-white">
                          {row.name}
                        </td>
                        <td className="px-6 py-2">
                          {categories!.find((category) => category.id === row.category_id)?.name}
                        </td>

                        <td className="px-6 py-2">{row.bio && row.bio.substring(0, 50)}</td>
                        <td className="px-6 py-2">{row.picture}</td>
                        <td className="flex items-center gap-2 px-6 py-2">
                          <button onClick={() => dispatch(deleteArtist(row.id))}>
                            <Text locale={locale} text="actions.delete" />
                          </button>
                          <p>|</p>
                          <button onClick={() => console.log('update')}>
                            <Text locale={locale} text="actions.edit" />
                          </button>
                        </td>
                      </tr>
                    ))
                  : artists.length == 0 && (
                      <tr>
                        <td colSpan={6}>
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
