'use client';

import ErrorComponent from '@/components/error';
import Text from '@/components/textLocale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AppDispatch, RootState } from '@/store';
import { fetchPlaylist, updatePlaylist } from '@/store/slices/playlistSlice';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface UpdatePlaylistFormProps {
  id: string;
  locale: string;
}

const UpdatePlaylistForm = ({ id, locale }: UpdatePlaylistFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { playlist, loading, error } = useSelector((state: RootState) => state.selectedPlaylist);

  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    if (id) {
      dispatch(fetchPlaylist(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (playlist) {
      setTitle(playlist.title);
    }
  }, [playlist]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playlist) {
      const updatedPlaylist = {
        id: playlist.id,
        title,
      };
      dispatch(updatePlaylist(updatedPlaylist))
        .unwrap()
        .then(() => {
          router.push(`/${locale}/dashboard?tab=playlists`);
        });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-900">
            <Text locale={locale} text="title.form_update_playlist" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center space-x-2 py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-gray-600">
                <Text locale={locale} text="update.loading" />
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  <Text locale={locale} text="tables.key.title" />
                </label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Text locale={locale} text="update.playlist" />
              </Button>
            </form>
          )}

          {error && (
            <div className="mt-4">
              <ErrorComponent message={error} locale={locale} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatePlaylistForm;
